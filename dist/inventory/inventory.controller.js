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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const store_context_guard_1 = require("../common/guards/store-context.guard");
const store_id_decorator_1 = require("../common/decorators/store-id.decorator");
class AdjustStockDto {
    menuItemId;
    quantity;
    notes;
}
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    getStockLevels(storeId) {
        return this.inventoryService.getStockLevels(storeId);
    }
    getLowStockAlerts(storeId) {
        return this.inventoryService.getLowStockAlerts(storeId);
    }
    getMovements(storeId, menuItemId) {
        return this.inventoryService.getMovements(storeId, menuItemId);
    }
    getBatches(menuItemId, storeId) {
        return this.inventoryService.getBatches(storeId, menuItemId);
    }
    adjustStock(dto, storeId) {
        return this.inventoryService.adjustStock(storeId, dto.menuItemId, dto.quantity, dto.notes);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('stock-levels'),
    __param(0, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockLevels", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    __param(0, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStockAlerts", null);
__decorate([
    (0, common_1.Get)('movements'),
    __param(0, (0, store_id_decorator_1.StoreId)()),
    __param(1, (0, common_1.Query)('menuItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)(':menuItemId/batches'),
    __param(0, (0, common_1.Param)('menuItemId')),
    __param(1, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Post)('adjust'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdjustStockDto, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "adjustStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, store_context_guard_1.StoreContextGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map