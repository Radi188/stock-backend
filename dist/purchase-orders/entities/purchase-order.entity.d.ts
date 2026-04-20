import { BaseEntity } from '../../common/base.entity';
import { PurchaseOrderStatus } from '../../common/enums';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Store } from '../../stores/entities/store.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
export declare class PurchaseOrder extends BaseEntity {
    orderNumber: string;
    status: PurchaseOrderStatus;
    orderDate: Date;
    expectedDate: Date;
    subtotal: number;
    tax: number;
    total: number;
    notes: string;
    supplier: Supplier;
    supplier_id: string;
    store: Store;
    store_id: string;
    items: PurchaseOrderItem[];
}
