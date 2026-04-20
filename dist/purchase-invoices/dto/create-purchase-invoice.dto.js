"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseInvoiceDto = exports.CreatePurchaseInvoiceItemDto = void 0;
class CreatePurchaseInvoiceItemDto {
    menuItemId;
    quantity;
    unitPrice;
}
exports.CreatePurchaseInvoiceItemDto = CreatePurchaseInvoiceItemDto;
class CreatePurchaseInvoiceDto {
    supplierId;
    purchaseOrderId;
    invoiceNumber;
    invoiceDate;
    dueDate;
    notes;
    items;
}
exports.CreatePurchaseInvoiceDto = CreatePurchaseInvoiceDto;
//# sourceMappingURL=create-purchase-invoice.dto.js.map