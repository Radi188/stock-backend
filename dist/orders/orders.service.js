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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const menu_item_entity_1 = require("../menu-items/entities/menu-item.entity");
const inventory_service_1 = require("../inventory/inventory.service");
const enums_1 = require("../common/enums");
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    menuItemRepo;
    inventoryService;
    dataSource;
    constructor(orderRepo, orderItemRepo, menuItemRepo, inventoryService, dataSource) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.menuItemRepo = menuItemRepo;
        this.inventoryService = inventoryService;
        this.dataSource = dataSource;
    }
    async create(storeId, userId, dto) {
        return this.dataSource.transaction(async (em) => {
            let subtotal = 0;
            const resolvedItems = [];
            for (const line of dto.items) {
                const item = await em.findOne(menu_item_entity_1.MenuItem, {
                    where: { id: line.menuItemId, store_id: storeId, isActive: true },
                });
                if (!item)
                    throw new common_1.NotFoundException(`Menu item ${line.menuItemId} not found`);
                const lineTotal = Number(item.price) * line.quantity;
                subtotal += lineTotal;
                resolvedItems.push({
                    menuItem: item,
                    quantity: line.quantity,
                    unitPrice: Number(item.price),
                    total: lineTotal,
                    notes: line.notes,
                });
            }
            const orderNumber = await this.nextOrderNumber(storeId);
            const order = em.create(order_entity_1.Order, {
                orderNumber,
                store_id: storeId,
                user_id: userId,
                tableNumber: dto.tableNumber,
                customerName: dto.customerName,
                notes: dto.notes,
                status: enums_1.OrderStatus.PENDING,
                subtotal,
                tax: 0,
                discount: 0,
                total: subtotal,
            });
            await em.save(order);
            for (const line of resolvedItems) {
                const orderItem = em.create(order_item_entity_1.OrderItem, {
                    order_id: order.id,
                    menu_item_id: line.menuItem.id,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    total: line.total,
                    notes: line.notes,
                });
                await em.save(orderItem);
            }
            return order;
        });
    }
    async updateStatus(orderId, storeId, status) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, store_id: storeId },
            relations: ['items'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const previousStatus = order.status;
        const validTransitions = {
            [enums_1.OrderStatus.PENDING]: [enums_1.OrderStatus.CONFIRMED, enums_1.OrderStatus.CANCELLED],
            [enums_1.OrderStatus.CONFIRMED]: [enums_1.OrderStatus.PREPARING, enums_1.OrderStatus.CANCELLED],
            [enums_1.OrderStatus.PREPARING]: [enums_1.OrderStatus.READY],
            [enums_1.OrderStatus.READY]: [enums_1.OrderStatus.DELIVERED],
        };
        if (!validTransitions[previousStatus]?.includes(status)) {
            throw new common_1.BadRequestException(`Cannot transition order from "${previousStatus}" to "${status}"`);
        }
        await this.dataSource.transaction(async (em) => {
            if (status === enums_1.OrderStatus.CONFIRMED) {
                for (const item of order.items) {
                    await this.inventoryService.deductFifo(storeId, item.menu_item_id, Number(item.quantity), order.id, em);
                }
            }
            if (status === enums_1.OrderStatus.CANCELLED &&
                previousStatus === enums_1.OrderStatus.CONFIRMED) {
                for (const item of order.items) {
                    await this.inventoryService.returnStock(storeId, item.menu_item_id, Number(item.quantity), order.id, em);
                }
            }
            await em.update(order_entity_1.Order, { id: orderId }, { status });
        });
        order.status = status;
        return order;
    }
    async findAll(storeId) {
        return this.orderRepo.find({
            where: { store_id: storeId },
            relations: ['items', 'items.menuItem'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(orderId, storeId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, store_id: storeId },
            relations: ['items', 'items.menuItem'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async nextOrderNumber(storeId) {
        const count = await this.orderRepo.count({ where: { store_id: storeId } });
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `ORD-${date}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        inventory_service_1.InventoryService,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map