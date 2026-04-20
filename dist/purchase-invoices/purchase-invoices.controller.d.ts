import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
export declare class PurchaseInvoicesController {
    private service;
    constructor(service: PurchaseInvoicesService);
    create(dto: CreatePurchaseInvoiceDto, storeId: string): Promise<import("./entities/purchase-invoice.entity").PurchaseInvoice>;
    findAll(storeId: string): Promise<import("./entities/purchase-invoice.entity").PurchaseInvoice[]>;
    findOne(id: string, storeId: string): Promise<import("./entities/purchase-invoice.entity").PurchaseInvoice>;
    receive(id: string, storeId: string): Promise<import("./entities/purchase-invoice.entity").PurchaseInvoice>;
}
