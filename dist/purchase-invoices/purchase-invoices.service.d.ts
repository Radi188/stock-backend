import { Repository, DataSource } from 'typeorm';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { PurchaseInvoiceItem } from './entities/purchase-invoice-item.entity';
import { InventoryService } from '../inventory/inventory.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
export declare class PurchaseInvoicesService {
    private invoiceRepo;
    private itemRepo;
    private inventoryService;
    private dataSource;
    constructor(invoiceRepo: Repository<PurchaseInvoice>, itemRepo: Repository<PurchaseInvoiceItem>, inventoryService: InventoryService, dataSource: DataSource);
    create(storeId: string, dto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoice>;
    receive(invoiceId: string, storeId: string): Promise<PurchaseInvoice>;
    findAll(storeId: string): Promise<PurchaseInvoice[]>;
    findOne(invoiceId: string, storeId: string): Promise<PurchaseInvoice>;
}
