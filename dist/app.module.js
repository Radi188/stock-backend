"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const stores_module_1 = require("./stores/stores.module");
const users_module_1 = require("./users/users.module");
const categories_module_1 = require("./categories/categories.module");
const subcategories_module_1 = require("./subcategories/subcategories.module");
const menu_items_module_1 = require("./menu-items/menu-items.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const purchase_orders_module_1 = require("./purchase-orders/purchase-orders.module");
const purchase_invoices_module_1 = require("./purchase-invoices/purchase-invoices.module");
const orders_module_1 = require("./orders/orders.module");
const invoices_module_1 = require("./invoices/invoices.module");
const auth_module_1 = require("./auth/auth.module");
const store_context_module_1 = require("./common/guards/store-context.module");
const inventory_module_1 = require("./inventory/inventory.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', 'postgres'),
                    database: config.get('DB_NAME', 'stock_control'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: config.get('NODE_ENV') !== 'production',
                }),
            }),
            auth_module_1.AuthModule,
            store_context_module_1.StoreContextModule,
            inventory_module_1.InventoryModule,
            stores_module_1.StoresModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            subcategories_module_1.SubcategoriesModule,
            menu_items_module_1.MenuItemsModule,
            suppliers_module_1.SuppliersModule,
            purchase_orders_module_1.PurchaseOrdersModule,
            purchase_invoices_module_1.PurchaseInvoicesModule,
            orders_module_1.OrdersModule,
            invoices_module_1.InvoicesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map