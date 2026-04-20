import { BaseEntity } from '../../common/base.entity';
import { OrderStatus } from '../../common/enums';
import { Store } from '../../stores/entities/store.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order extends BaseEntity {
    orderNumber: string;
    status: OrderStatus;
    tableNumber: string;
    customerName: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    notes: string;
    store: Store;
    store_id: string;
    user: User;
    user_id: string;
    items: OrderItem[];
}
