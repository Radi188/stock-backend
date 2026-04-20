import { BaseEntity } from '../../common/base.entity';
import { Order } from './order.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
export declare class OrderItem extends BaseEntity {
    quantity: number;
    unitPrice: number;
    total: number;
    notes: string;
    order: Order;
    order_id: string;
    menuItem: MenuItem;
    menu_item_id: string;
}
