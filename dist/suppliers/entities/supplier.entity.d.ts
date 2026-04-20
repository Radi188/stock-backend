import { BaseEntity } from '../../common/base.entity';
import { Store } from '../../stores/entities/store.entity';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
export declare class Supplier extends BaseEntity {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    taxNumber: string;
    isActive: boolean;
    store: Store;
    store_id: string;
    purchaseOrders: PurchaseOrder[];
}
