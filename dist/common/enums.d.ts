export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    CASHIER = "cashier",
    STAFF = "staff"
}
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY = "ready",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    SENT = "sent",
    CONFIRMED = "confirmed",
    RECEIVED = "received",
    CANCELLED = "cancelled"
}
export declare enum InvoiceStatus {
    DRAFT = "draft",
    ISSUED = "issued",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}
export declare enum StockMovementType {
    PURCHASE = "purchase",
    SALE = "sale",
    ADJUSTMENT_IN = "adjustment_in",
    ADJUSTMENT_OUT = "adjustment_out",
    RETURN_IN = "return_in",
    RETURN_OUT = "return_out"
}
