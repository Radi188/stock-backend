"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderStatusDto = exports.CreateOrderDto = exports.CreateOrderItemDto = void 0;
class CreateOrderItemDto {
    menuItemId;
    quantity;
    notes;
}
exports.CreateOrderItemDto = CreateOrderItemDto;
class CreateOrderDto {
    tableNumber;
    customerName;
    notes;
    items;
}
exports.CreateOrderDto = CreateOrderDto;
class UpdateOrderStatusDto {
    status;
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
//# sourceMappingURL=create-order.dto.js.map