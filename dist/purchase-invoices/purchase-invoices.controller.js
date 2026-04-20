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
exports.PurchaseInvoicesController = void 0;
const common_1 = require("@nestjs/common");
const purchase_invoices_service_1 = require("./purchase-invoices.service");
const create_purchase_invoice_dto_1 = require("./dto/create-purchase-invoice.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const store_context_guard_1 = require("../common/guards/store-context.guard");
const store_id_decorator_1 = require("../common/decorators/store-id.decorator");
let PurchaseInvoicesController = class PurchaseInvoicesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, storeId) {
        return this.service.create(storeId, dto);
    }
    findAll(storeId) {
        return this.service.findAll(storeId);
    }
    findOne(id, storeId) {
        return this.service.findOne(id, storeId);
    }
    receive(id, storeId) {
        return this.service.receive(id, storeId);
    }
};
exports.PurchaseInvoicesController = PurchaseInvoicesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_invoice_dto_1.CreatePurchaseInvoiceDto, String]),
    __metadata("design:returntype", void 0)
], PurchaseInvoicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseInvoicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PurchaseInvoicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/receive'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, store_id_decorator_1.StoreId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PurchaseInvoicesController.prototype, "receive", null);
exports.PurchaseInvoicesController = PurchaseInvoicesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, store_context_guard_1.StoreContextGuard),
    (0, common_1.Controller)('purchase-invoices'),
    __metadata("design:paramtypes", [purchase_invoices_service_1.PurchaseInvoicesService])
], PurchaseInvoicesController);
//# sourceMappingURL=purchase-invoices.controller.js.map