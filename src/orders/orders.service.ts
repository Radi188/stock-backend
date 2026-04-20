import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { InventoryService } from '../inventory/inventory.service';
import { OrderStatus } from '../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    private inventoryService: InventoryService,
    private dataSource: DataSource,
  ) {}

  async create(storeId: string, userId: string, dto: CreateOrderDto): Promise<Order> {
    return this.dataSource.transaction(async (em) => {
      // Load menu items and calculate totals
      let subtotal = 0;
      const resolvedItems: Array<{
        menuItem: MenuItem;
        quantity: number;
        unitPrice: number;
        total: number;
        notes?: string;
      }> = [];

      for (const line of dto.items) {
        const item = await em.findOne(MenuItem, {
          where: { id: line.menuItemId, store_id: storeId, isActive: true },
        });
        if (!item) throw new NotFoundException(`Menu item ${line.menuItemId} not found`);

        const lineTotal = Number(item.price) * line.quantity;
        subtotal += lineTotal;
        resolvedItems.push({
          menuItem: item,
          quantity: line.quantity,
          unitPrice: Number(item.price),
          total: lineTotal,
          notes: line.notes,
        });
      }

      const orderNumber = await this.nextOrderNumber(storeId);
      const order = em.create(Order, {
        orderNumber,
        store_id: storeId,
        user_id: userId,
        tableNumber: dto.tableNumber,
        customerName: dto.customerName,
        notes: dto.notes,
        status: OrderStatus.PENDING,
        subtotal,
        tax: 0,
        discount: 0,
        total: subtotal,
      });
      await em.save(order);

      for (const line of resolvedItems) {
        const orderItem = em.create(OrderItem, {
          order_id: order.id,
          menu_item_id: line.menuItem.id,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          total: line.total,
          notes: line.notes,
        });
        await em.save(orderItem);
      }

      return order;
    });
  }

  async updateStatus(
    orderId: string,
    storeId: string,
    status: OrderStatus,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, store_id: storeId },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const previousStatus = order.status;
    const validTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
      [OrderStatus.PENDING]:   [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY],
      [OrderStatus.READY]:     [OrderStatus.DELIVERED],
    };

    if (!validTransitions[previousStatus]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition order from "${previousStatus}" to "${status}"`,
      );
    }

    await this.dataSource.transaction(async (em) => {
      // Deduct stock when order is confirmed
      if (status === OrderStatus.CONFIRMED) {
        for (const item of order.items) {
          await this.inventoryService.deductFifo(
            storeId,
            item.menu_item_id,
            Number(item.quantity),
            order.id,
            em,
          );
        }
      }

      // Return stock if a confirmed order is cancelled
      if (
        status === OrderStatus.CANCELLED &&
        previousStatus === OrderStatus.CONFIRMED
      ) {
        for (const item of order.items) {
          await this.inventoryService.returnStock(
            storeId,
            item.menu_item_id,
            Number(item.quantity),
            order.id,
            em,
          );
        }
      }

      await em.update(Order, { id: orderId }, { status });
    });

    order.status = status;
    return order;
  }

  async findAll(storeId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { store_id: storeId },
      relations: ['items', 'items.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orderId: string, storeId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, store_id: storeId },
      relations: ['items', 'items.menuItem'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private async nextOrderNumber(storeId: string): Promise<string> {
    const count = await this.orderRepo.count({ where: { store_id: storeId } });
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `ORD-${date}-${String(count + 1).padStart(4, '0')}`;
  }
}
