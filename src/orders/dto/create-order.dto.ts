export class CreateOrderItemDto {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

export class CreateOrderDto {
  tableNumber?: string;
  customerName?: string;
  notes?: string;
  items: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  status: string;
}
