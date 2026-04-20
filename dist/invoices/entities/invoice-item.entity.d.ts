import { BaseEntity } from '../../common/base.entity';
import { Invoice } from './invoice.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
export declare class InvoiceItem extends BaseEntity {
    quantity: number;
    unitPrice: number;
    total: number;
    notes: string;
    invoice: Invoice;
    invoice_id: string;
    menuItem: MenuItem;
    menu_item_id: string;
}
