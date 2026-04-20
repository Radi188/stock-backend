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
exports.PurchaseInvoiceItem = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/base.entity");
const purchase_invoice_entity_1 = require("./purchase-invoice.entity");
const menu_item_entity_1 = require("../../menu-items/entities/menu-item.entity");
let PurchaseInvoiceItem = class PurchaseInvoiceItem extends base_entity_1.BaseEntity {
    quantity;
    unitPrice;
    total;
    purchaseInvoice;
    purchase_invoice_id;
    menuItem;
    menu_item_id;
};
exports.PurchaseInvoiceItem = PurchaseInvoiceItem;
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseInvoiceItem.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_invoice_entity_1.PurchaseInvoice, (inv) => inv.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_invoice_id' }),
    __metadata("design:type", purchase_invoice_entity_1.PurchaseInvoice)
], PurchaseInvoiceItem.prototype, "purchaseInvoice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseInvoiceItem.prototype, "purchase_invoice_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem),
    (0, typeorm_1.JoinColumn)({ name: 'menu_item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], PurchaseInvoiceItem.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchaseInvoiceItem.prototype, "menu_item_id", void 0);
exports.PurchaseInvoiceItem = PurchaseInvoiceItem = __decorate([
    (0, typeorm_1.Entity)('purchase_invoice_items')
], PurchaseInvoiceItem);
//# sourceMappingURL=purchase-invoice-item.entity.js.map