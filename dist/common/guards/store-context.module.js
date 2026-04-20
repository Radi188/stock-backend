"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreContextModule = void 0;
const common_1 = require("@nestjs/common");
const store_context_guard_1 = require("./store-context.guard");
let StoreContextModule = class StoreContextModule {
};
exports.StoreContextModule = StoreContextModule;
exports.StoreContextModule = StoreContextModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [store_context_guard_1.StoreContextGuard],
        exports: [store_context_guard_1.StoreContextGuard],
    })
], StoreContextModule);
//# sourceMappingURL=store-context.module.js.map