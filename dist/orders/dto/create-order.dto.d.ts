export declare class CreateOrderItemDto {
    menuItemId: string;
    quantity: number;
    notes?: string;
}
export declare class CreateOrderDto {
    tableNumber?: string;
    customerName?: string;
    notes?: string;
    items: CreateOrderItemDto[];
}
export declare class UpdateOrderStatusDto {
    status: string;
}
