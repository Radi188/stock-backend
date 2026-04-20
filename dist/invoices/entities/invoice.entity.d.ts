import { BaseEntity } from '../../common/base.entity';
import { InvoiceStatus } from '../../common/enums';
import { Store } from '../../stores/entities/store.entity';
import { Order } from '../../orders/entities/order.entity';
import { InvoiceItem } from './invoice-item.entity';
export declare class Invoice extends BaseEntity {
    invoiceNumber: string;
    status: InvoiceStatus;
    invoiceDate: Date;
    dueDate: Date;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    amountPaid: number;
    notes: string;
    order: Order;
    order_id: string;
    store: Store;
    store_id: string;
    items: InvoiceItem[];
}
