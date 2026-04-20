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
exports.PurchaseInvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_invoice_entity_1 = require("./entities/purchase-invoice.entity");
const purchase_invoice_item_entity_1 = require("./entities/purchase-invoice-item.entity");
const inventory_service_1 = require("../inventory/inventory.service");
const enums_1 = require("../common/enums");
let PurchaseInvoicesService = class PurchaseInvoicesService {
    invoiceRepo;
    itemRepo;
    inventoryService;
    dataSource;
    constructor(invoiceRepo, itemRepo, inventoryService, dataSource) {
        this.invoiceRepo = invoiceRepo;
        this.itemRepo = itemRepo;
        this.inventoryService = inventoryService;
        this.dataSource = dataSource;
    }
    async create(storeId, dto) {
        return this.dataSource.transaction(async (em) => {
            let subtotal = 0;
            const lines = dto.items.map((i) => {
                const total = i.quantity * i.unitPrice;
                subtotal += total;
                return { ...i, total };
            });
            const invoice = em.create(purchase_invoice_entity_1.PurchaseInvoice, {
                invoiceNumber: dto.invoiceNumber,
                store_id: storeId,
                supplier_id: dto.supplierId,
                purchase_order_id: dto.purchaseOrderId,
                invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : undefined,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                notes: dto.notes,
                status: enums_1.InvoiceStatus.DRAFT,
                subtotal,
                tax: 0,
                total: subtotal,
            });
            await em.save(invoice);
            for (const line of lines) {
                await em.save(em.create(purchase_invoice_item_entity_1.PurchaseInvoiceItem, {
                    purchase_invoice_id: invoice.id,
                    menu_item_id: line.menuItemId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    total: line.total,
                }));
            }
            return invoice;
        });
    }
    async receive(invoiceId, storeId) {
        const invoice = await this.invoiceRepo.findOne({
            where: { id: invoiceId, store_id: storeId },
            relations: ['items'],
        });
        if (!invoice)
            throw new common_1.NotFoundException('Purchase invoice not found');
        if (invoice.status !== enums_1.InvoiceStatus.DRAFT && invoice.status !== enums_1.InvoiceStatus.ISSUED) {
            throw new common_1.BadRequestException(`Invoice is already "${invoice.status}"`);
        }
        await this.dataSource.transaction(async (em) => {
            for (const item of invoice.items) {
                await this.inventoryService.addBatch(storeId, item.menu_item_id, Number(item.quantity), Number(item.unitPrice), item.id, em);
            }
            await em.update(purchase_invoice_entity_1.PurchaseInvoice, { id: invoiceId }, { status: enums_1.InvoiceStatus.PAID });
        });
        invoice.status = enums_1.InvoiceStatus.PAID;
        return invoice;
    }
    async findAll(storeId) {
        return this.invoiceRepo.find({
            where: { store_id: storeId },
            relations: ['supplier', 'items', 'items.menuItem'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(invoiceId, storeId) {
        const invoice = await this.invoiceRepo.findOne({
            where: { id: invoiceId, store_id: storeId },
            relations: ['supplier', 'items', 'items.menuItem'],
        });
        if (!invoice)
            throw new common_1.NotFoundException('Purchase invoice not found');
        return invoice;
    }
};
exports.PurchaseInvoicesService = PurchaseInvoicesService;
exports.PurchaseInvoicesService = PurchaseInvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_invoice_entity_1.PurchaseInvoice)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_invoice_item_entity_1.PurchaseInvoiceItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        inventory_service_1.InventoryService,
        typeorm_2.DataSource])
], PurchaseInvoicesService);
//# sourceMappingURL=purchase-invoices.service.js.map