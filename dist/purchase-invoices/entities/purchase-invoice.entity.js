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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseInvoice = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/base.entity");
const enums_1 = require("../../common/enums");
const supplier_entity_1 = require("../../suppliers/entities/supplier.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
const purchase_order_entity_1 = require("../../purchase-orders/entities/purchase-order.entity");
const purchase_invoice_item_entity_1 = require("./purchase-invoice-item.entity");
let PurchaseInvoice = class PurchaseInvoice extends base_entity_1.BaseEntity {
    invoiceNumber;
    status;
    invoiceDate;
    dueDate;
    subtotal;
    tax;
    total;
    notes;
    purchaseOrder;
    purchase_order_id;
    supplier;
    supplier_id;
    store;
    store_id;
    items;
};
exports.PurchaseInvoice = PurchaseInvoice;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.InvoiceStatus, default: enums_1.InvoiceStatus.DRAFT }),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseInvoice.prototype, "invoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PurchaseInvoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PurchaseInvoice.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrder, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_order_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrder)
], PurchaseInvoice.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "purchase_order_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], PurchaseInvoice.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "supplier_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], PurchaseInvoice.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseInvoice.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_invoice_item_entity_1.PurchaseInvoiceItem, (item) => item.purchaseInvoice, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], PurchaseInvoice.prototype, "items", void 0);
exports.PurchaseInvoice = PurchaseInvoice = __decorate([
    (0, typeorm_1.Entity)('purchase_invoices'),
    (0, typeorm_1.Index)(['store_id', 'invoiceNumber'], { unique: true })
], PurchaseInvoice);
//# sourceMappingURL=purchase-invoice.entity.js.map