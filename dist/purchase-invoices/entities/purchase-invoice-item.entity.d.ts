import { BaseEntity } from '../../common/base.entity';
import { PurchaseInvoice } from './purchase-invoice.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
export declare class PurchaseInvoiceItem extends BaseEntity {
    quantity: number;
    unitPrice: number;
    total: number;
    purchaseInvoice: PurchaseInvoice;
    purchase_invoice_id: string;
    menuItem: MenuItem;
    menu_item_id: string;
}
