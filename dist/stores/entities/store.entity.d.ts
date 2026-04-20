import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Store extends BaseEntity {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
    website: string;
    googleMapsEmbed: string;
    isActive: boolean;
    users: User[];
    categories: Category[];
    suppliers: Supplier[];
    orders: Order[];
}
