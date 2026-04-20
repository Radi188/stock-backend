import { InventoryService } from './inventory.service';
declare class AdjustStockDto {
    menuItemId: string;
    quantity: number;
    notes?: string;
}
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
    getStockLevels(storeId: string): Promise<import("../menu-items/entities/menu-item.entity").MenuItem[]>;
    getLowStockAlerts(storeId: string): Promise<import("../menu-items/entities/menu-item.entity").MenuItem[]>;
    getMovements(storeId: string, menuItemId?: string): Promise<import("./entities/stock-movement.entity").StockMovement[]>;
    getBatches(menuItemId: string, storeId: string): Promise<import("./entities/inventory-batch.entity").InventoryBatch[]>;
    adjustStock(dto: AdjustStockDto, storeId: string): Promise<void>;
}
export {};
