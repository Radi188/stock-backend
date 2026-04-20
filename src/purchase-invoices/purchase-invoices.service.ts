import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PurchaseInvoice } from './entities/purchase-invoice.entity';
import { PurchaseInvoiceItem } from './entities/purchase-invoice-item.entity';
import { InventoryService } from '../inventory/inventory.service';
import { InvoiceStatus } from '../common/enums';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';

@Injectable()
export class PurchaseInvoicesService {
  constructor(
    @InjectRepository(PurchaseInvoice)
    private invoiceRepo: Repository<PurchaseInvoice>,
    @InjectRepository(PurchaseInvoiceItem)
    private itemRepo: Repository<PurchaseInvoiceItem>,
    private inventoryService: InventoryService,
    private dataSource: DataSource,
  ) {}

  async create(storeId: string, dto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoice> {
    return this.dataSource.transaction(async (em) => {
      let subtotal = 0;
      const lines = dto.items.map((i) => {
        const total = i.quantity * i.unitPrice;
        subtotal += total;
        return { ...i, total };
      });

      const invoice = em.create(PurchaseInvoice, {
        invoiceNumber: dto.invoiceNumber,
        store_id: storeId,
        supplier_id: dto.supplierId,
        purchase_order_id: dto.purchaseOrderId,
        invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        notes: dto.notes,
        status: InvoiceStatus.DRAFT,
        subtotal,
        tax: 0,
        total: subtotal,
      } as any);
      await em.save(invoice);

      for (const line of lines) {
        await em.save(
          em.create(PurchaseInvoiceItem, {
            purchase_invoice_id: invoice.id,
            menu_item_id: line.menuItemId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            total: line.total,
          }),
        );
      }

      return invoice;
    });
  }

  /** Marks the invoice as PAID and adds inventory batches for all items (FIFO IN) */
  async receive(invoiceId: string, storeId: string): Promise<PurchaseInvoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id: invoiceId, store_id: storeId },
      relations: ['items'],
    });
    if (!invoice) throw new NotFoundException('Purchase invoice not found');
    if (invoice.status !== InvoiceStatus.DRAFT && invoice.status !== InvoiceStatus.ISSUED) {
      throw new BadRequestException(`Invoice is already "${invoice.status}"`);
    }

    await this.dataSource.transaction(async (em) => {
      for (const item of invoice.items) {
        await this.inventoryService.addBatch(
          storeId,
          item.menu_item_id,
          Number(item.quantity),
          Number(item.unitPrice),
          item.id,
          em,
        );
      }
      await em.update(PurchaseInvoice, { id: invoiceId }, { status: InvoiceStatus.PAID });
    });

    invoice.status = InvoiceStatus.PAID;
    return invoice;
  }

  async findAll(storeId: string): Promise<PurchaseInvoice[]> {
    return this.invoiceRepo.find({
      where: { store_id: storeId },
      relations: ['supplier', 'items', 'items.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(invoiceId: string, storeId: string): Promise<PurchaseInvoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id: invoiceId, store_id: storeId },
      relations: ['supplier', 'items', 'items.menuItem'],
    });
    if (!invoice) throw new NotFoundException('Purchase invoice not found');
    return invoice;
  }
}
