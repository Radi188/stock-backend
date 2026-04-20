import { BaseEntity } from '../../common/base.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { Store } from '../../stores/entities/store.entity';
import { StockMovementType } from '../../common/enums';
export declare class StockMovement extends BaseEntity {
    store: Store;
    store_id: string;
    menuItem: MenuItem;
    menu_item_id: string;
    type: StockMovementType;
    quantity: number;
    unitCost: number;
    balance: number;
    referenceId: string;
    referenceType: string;
    notes: string;
}
