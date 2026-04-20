"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementType = exports.InvoiceStatus = exports.PurchaseOrderStatus = exports.OrderStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["CASHIER"] = "cashier";
    UserRole["STAFF"] = "staff";
})(UserRole || (exports.UserRole = UserRole = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PREPARING"] = "preparing";
    OrderStatus["READY"] = "ready";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "draft";
    PurchaseOrderStatus["SENT"] = "sent";
    PurchaseOrderStatus["CONFIRMED"] = "confirmed";
    PurchaseOrderStatus["RECEIVED"] = "received";
    PurchaseOrderStatus["CANCELLED"] = "cancelled";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["ISSUED"] = "issued";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["CANCELLED"] = "cancelled";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
var StockMovementType;
(function (StockMovementType) {
    StockMovementType["PURCHASE"] = "purchase";
    StockMovementType["SALE"] = "sale";
    StockMovementType["ADJUSTMENT_IN"] = "adjustment_in";
    StockMovementType["ADJUSTMENT_OUT"] = "adjustment_out";
    StockMovementType["RETURN_IN"] = "return_in";
    StockMovementType["RETURN_OUT"] = "return_out";
})(StockMovementType || (exports.StockMovementType = StockMovementType = {}));
//# sourceMappingURL=enums.js.map