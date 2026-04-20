export class CreatePurchaseInvoiceItemDto {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
}

export class CreatePurchaseInvoiceDto {
  supplierId: string;
  purchaseOrderId?: string;
  invoiceNumber: string;
  invoiceDate?: string;
  dueDate?: string;
  notes?: string;
  items: CreatePurchaseInvoiceItemDto[];
}
