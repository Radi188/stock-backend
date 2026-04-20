import { BaseEntity } from '../../common/base.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class InventoryBatch extends BaseEntity {
    store: Store;
    store_id: string;
    menuItem: MenuItem;
    menu_item_id: string;
    quantity: number;
    quantityRemaining: number;
    unitCost: number;
    receivedAt: Date;
    referenceId: string;
}
