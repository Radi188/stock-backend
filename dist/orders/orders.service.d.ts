import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { InventoryService } from '../inventory/inventory.service';
import { OrderStatus } from '../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderRepo;
    private orderItemRepo;
    private menuItemRepo;
    private inventoryService;
    private dataSource;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, menuItemRepo: Repository<MenuItem>, inventoryService: InventoryService, dataSource: DataSource);
    create(storeId: string, userId: string, dto: CreateOrderDto): Promise<Order>;
    updateStatus(orderId: string, storeId: string, status: OrderStatus): Promise<Order>;
    findAll(storeId: string): Promise<Order[]>;
    findOne(orderId: string, storeId: string): Promise<Order>;
    private nextOrderNumber;
}
