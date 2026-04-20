import { BaseEntity } from '../../common/base.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
export declare class PurchaseOrderItem extends BaseEntity {
    quantity: number;
    unitPrice: number;
    total: number;
    notes: string;
    purchaseOrder: PurchaseOrder;
    purchase_order_id: string;
    menuItem: MenuItem;
    menu_item_id: string;
}
