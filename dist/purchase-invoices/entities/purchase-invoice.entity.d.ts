import { BaseEntity } from '../../common/base.entity';
import { InvoiceStatus } from '../../common/enums';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Store } from '../../stores/entities/store.entity';
import { PurchaseOrder } from '../../purchase-orders/entities/purchase-order.entity';
import { PurchaseInvoiceItem } from './purchase-invoice-item.entity';
export declare class PurchaseInvoice extends BaseEntity {
    invoiceNumber: string;
    status: InvoiceStatus;
    invoiceDate: Date;
    dueDate: Date;
    subtotal: number;
    tax: number;
    total: number;
    notes: string;
    purchaseOrder: PurchaseOrder;
    purchase_order_id: string;
    supplier: Supplier;
    supplier_id: string;
    store: Store;
    store_id: string;
    items: PurchaseInvoiceItem[];
}
