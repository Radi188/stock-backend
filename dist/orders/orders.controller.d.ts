import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, storeId: string, user: {
        id: string;
    }): Promise<import("./entities/order.entity").Order>;
    findAll(storeId: string): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string, storeId: string): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, storeId: string): Promise<import("./entities/order.entity").Order>;
}
