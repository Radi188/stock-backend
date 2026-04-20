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
exports.InventoryBatch = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/base.entity");
const menu_item_entity_1 = require("../../menu-items/entities/menu-item.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
let InventoryBatch = class InventoryBatch extends base_entity_1.BaseEntity {
    store;
    store_id;
    menuItem;
    menu_item_id;
    quantity;
    quantityRemaining;
    unitCost;
    receivedAt;
    referenceId;
};
exports.InventoryBatch = InventoryBatch;
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], InventoryBatch.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InventoryBatch.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_item_entity_1.MenuItem),
    (0, typeorm_1.JoinColumn)({ name: 'menu_item_id' }),
    __metadata("design:type", menu_item_entity_1.MenuItem)
], InventoryBatch.prototype, "menuItem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InventoryBatch.prototype, "menu_item_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], InventoryBatch.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3 }),
    __metadata("design:type", Number)
], InventoryBatch.prototype, "quantityRemaining", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], InventoryBatch.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], InventoryBatch.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "referenceId", void 0);
exports.InventoryBatch = InventoryBatch = __decorate([
    (0, typeorm_1.Entity)('inventory_batches'),
    (0, typeorm_1.Index)(['store_id', 'menu_item_id'])
], InventoryBatch);
//# sourceMappingURL=inventory-batch.entity.js.map