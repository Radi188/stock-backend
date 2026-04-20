import { Repository, EntityManager, DataSource } from 'typeorm';
import { InventoryBatch } from './entities/inventory-batch.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
export declare class InventoryService {
    private batchRepo;
    private movementRepo;
    private menuItemRepo;
    private dataSource;
    constructor(batchRepo: Repository<InventoryBatch>, movementRepo: Repository<StockMovement>, menuItemRepo: Repository<MenuItem>, dataSource: DataSource);
    addBatch(storeId: string, menuItemId: string, quantity: number, unitCost: number, referenceId: string, em?: EntityManager): Promise<void>;
    deductFifo(storeId: string, menuItemId: string, quantity: number, referenceId: string, em?: EntityManager): Promise<void>;
    returnStock(storeId: string, menuItemId: string, quantity: number, referenceId: string, em?: EntityManager): Promise<void>;
    adjustStock(storeId: string, menuItemId: string, quantity: number, notes?: string): Promise<void>;
    getStockLevels(storeId: string): Promise<MenuItem[]>;
    getLowStockAlerts(storeId: string): Promise<MenuItem[]>;
    getMovements(storeId: string, menuItemId?: string): Promise<StockMovement[]>;
    getBatches(storeId: string, menuItemId: string): Promise<InventoryBatch[]>;
    private currentBalance;
}
