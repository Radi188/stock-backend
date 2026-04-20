"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventory_batch_entity_1 = require("./entities/inventory-batch.entity");
const stock_movement_entity_1 = require("./entities/stock-movement.entity");
const menu_item_entity_1 = require("../menu-items/entities/menu-item.entity");
const enums_1 = require("../common/enums");
let InventoryService = class InventoryService {
    batchRepo;
    movementRepo;
    menuItemRepo;
    dataSource;
    constructor(batchRepo, movementRepo, menuItemRepo, dataSource) {
        this.batchRepo = batchRepo;
        this.movementRepo = movementRepo;
        this.menuItemRepo = menuItemRepo;
        this.dataSource = dataSource;
    }
    async addBatch(storeId, menuItemId, quantity, unitCost, referenceId, em) {
        const runner = em ?? this.dataSource.manager;
        const batch = runner.create(inventory_batch_entity_1.InventoryBatch, {
            store_id: storeId,
            menu_item_id: menuItemId,
            quantity,
            quantityRemaining: quantity,
            unitCost,
            receivedAt: new Date(),
            referenceId,
        });
        await runner.save(batch);
        await runner
            .createQueryBuilder()
            .update(menu_item_entity_1.MenuItem)
            .set({ stock: () => `stock + ${quantity}` })
            .where('id = :id', { id: menuItemId })
            .execute();
        const balance = await this.currentBalance(runner, storeId, menuItemId);
        await runner.save(runner.create(stock_movement_entity_1.StockMovement, {
            store_id: storeId,
            menu_item_id: menuItemId,
            type: enums_1.StockMovementType.PURCHASE,
            quantity,
            unitCost,
            balance,
            referenceId,
            referenceType: 'purchase_invoice',
        }));
    }
    async deductFifo(storeId, menuItemId, quantity, referenceId, em) {
        const runner = em ?? this.dataSource.manager;
        const batches = await runner.find(inventory_batch_entity_1.InventoryBatch, {
            where: {
                store_id: storeId,
                menu_item_id: menuItemId,
                quantityRemaining: (0, typeorm_2.MoreThan)(0),
            },
            order: { receivedAt: 'ASC' },
            lock: { mode: 'pessimistic_write' },
        });
        const totalAvailable = batches.reduce((sum, b) => sum + Number(b.quantityRemaining), 0);
        if (totalAvailable < quantity) {
            const item = await this.menuItemRepo.findOne({ where: { id: menuItemId } });
            throw new common_1.BadRequestException(`Insufficient stock for "${item?.name ?? menuItemId}". Available: ${totalAvailable}, Required: ${quantity}`);
        }
        let remaining = quantity;
        for (const batch of batches) {
            if (remaining <= 0)
                break;
            const deduct = Math.min(Number(batch.quantityRemaining), remaining);
            batch.quantityRemaining = Number(batch.quantityRemaining) - deduct;
            remaining -= deduct;
            await runner.save(batch);
        }
        await runner
            .createQueryBuilder()
            .update(menu_item_entity_1.MenuItem)
            .set({ stock: () => `stock - ${quantity}` })
            .where('id = :id', { id: menuItemId })
            .execute();
        const balance = totalAvailable - quantity;
        await runner.save(runner.create(stock_movement_entity_1.StockMovement, {
            store_id: storeId,
            menu_item_id: menuItemId,
            type: enums_1.StockMovementType.SALE,
            quantity: -quantity,
            balance,
            referenceId,
            referenceType: 'order',
        }));
    }
    async returnStock(storeId, menuItemId, quantity, referenceId, em) {
        const runner = em ?? this.dataSource.manager;
        const batch = runner.create(inventory_batch_entity_1.InventoryBatch, {
            store_id: storeId,
            menu_item_id: menuItemId,
            quantity,
            quantityRemaining: quantity,
            unitCost: 0,
            receivedAt: new Date(),
            referenceId,
        });
        await runner.save(batch);
        await runner
            .createQueryBuilder()
            .update(menu_item_entity_1.MenuItem)
            .set({ stock: () => `stock + ${quantity}` })
            .where('id = :id', { id: menuItemId })
            .execute();
        const balance = await this.currentBalance(runner, storeId, menuItemId);
        await runner.save(runner.create(stock_movement_entity_1.StockMovement, {
            store_id: storeId,
            menu_item_id: menuItemId,
            type: enums_1.StockMovementType.RETURN_IN,
            quantity,
            balance,
            referenceId,
            referenceType: 'order_cancellation',
        }));
    }
    async adjustStock(storeId, menuItemId, quantity, notes) {
        const item = await this.menuItemRepo.findOne({
            where: { id: menuItemId, store_id: storeId },
        });
        if (!item)
            throw new common_1.NotFoundException('Menu item not found in this store');
        await this.dataSource.transaction(async (em) => {
            if (quantity > 0) {
                const batch = em.create(inventory_batch_entity_1.InventoryBatch, {
                    store_id: storeId,
                    menu_item_id: menuItemId,
                    quantity,
                    quantityRemaining: quantity,
                    unitCost: 0,
                    receivedAt: new Date(),
                });
                await em.save(batch);
            }
            else if (quantity < 0) {
                const abs = Math.abs(quantity);
                const batches = await em.find(inventory_batch_entity_1.InventoryBatch, {
                    where: { store_id: storeId, menu_item_id: menuItemId, quantityRemaining: (0, typeorm_2.MoreThan)(0) },
                    order: { receivedAt: 'ASC' },
                    lock: { mode: 'pessimistic_write' },
                });
                const available = batches.reduce((s, b) => s + Number(b.quantityRemaining), 0);
                if (available < abs)
                    throw new common_1.BadRequestException(`Cannot adjust: only ${available} in stock`);
                let remaining = abs;
                for (const batch of batches) {
                    if (remaining <= 0)
                        break;
                    const deduct = Math.min(Number(batch.quantityRemaining), remaining);
                    batch.quantityRemaining = Number(batch.quantityRemaining) - deduct;
                    remaining -= deduct;
                    await em.save(batch);
                }
            }
            await em
                .createQueryBuilder()
                .update(menu_item_entity_1.MenuItem)
                .set({ stock: () => `stock + ${quantity}` })
                .where('id = :id', { id: menuItemId })
                .execute();
            const balance = await this.currentBalance(em, storeId, menuItemId);
            await em.save(em.create(stock_movement_entity_1.StockMovement, {
                store_id: storeId,
                menu_item_id: menuItemId,
                type: quantity >= 0 ? enums_1.StockMovementType.ADJUSTMENT_IN : enums_1.StockMovementType.ADJUSTMENT_OUT,
                quantity,
                balance,
                notes,
            }));
        });
    }
    async getStockLevels(storeId) {
        return this.menuItemRepo.find({
            where: { store_id: storeId, isActive: true },
            select: ['id', 'name', 'sku', 'unit', 'stock', 'lowStockThreshold', 'isAvailable'],
        });
    }
    async getLowStockAlerts(storeId) {
        return this.menuItemRepo
            .createQueryBuilder('m')
            .where('m.store_id = :storeId', { storeId })
            .andWhere('m.isActive = true')
            .andWhere('m.stock <= m.lowStockThreshold')
            .andWhere('m.lowStockThreshold > 0')
            .orderBy('m.stock', 'ASC')
            .getMany();
    }
    async getMovements(storeId, menuItemId) {
        const qb = this.movementRepo
            .createQueryBuilder('m')
            .leftJoinAndSelect('m.menuItem', 'item')
            .where('m.store_id = :storeId', { storeId })
            .orderBy('m.createdAt', 'DESC')
            .take(200);
        if (menuItemId)
            qb.andWhere('m.menu_item_id = :menuItemId', { menuItemId });
        return qb.getMany();
    }
    async getBatches(storeId, menuItemId) {
        return this.batchRepo.find({
            where: { store_id: storeId, menu_item_id: menuItemId, quantityRemaining: (0, typeorm_2.MoreThan)(0) },
            order: { receivedAt: 'ASC' },
        });
    }
    async currentBalance(em, storeId, menuItemId) {
        const result = await em
            .createQueryBuilder(inventory_batch_entity_1.InventoryBatch, 'b')
            .select('COALESCE(SUM(b.quantityRemaining), 0)', 'total')
            .where('b.store_id = :storeId AND b.menu_item_id = :menuItemId', { storeId, menuItemId })
            .getRawOne();
        return Number(result?.total ?? 0);
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventory_batch_entity_1.InventoryBatch)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map