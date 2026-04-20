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
exports.StoreContextGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../enums");
let StoreContextGuard = class StoreContextGuard {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const storeId = request.headers['x-store-id'];
        if (!storeId) {
            throw new common_1.BadRequestException('x-store-id header is required');
        }
        if (request.user?.role === enums_1.UserRole.ADMIN) {
            request.storeId = storeId;
            return true;
        }
        const rows = await this.dataSource.query(`SELECT 1 FROM user_stores WHERE user_id = $1 AND store_id = $2`, [request.user.id, storeId]);
        if (!rows.length) {
            throw new common_1.ForbiddenException('You do not have access to this store');
        }
        request.storeId = storeId;
        return true;
    }
};
exports.StoreContextGuard = StoreContextGuard;
exports.StoreContextGuard = StoreContextGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], StoreContextGuard);
//# sourceMappingURL=store-context.guard.js.map