import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  EntityManager,
  DataSource,
  MoreThan,
  LessThan,
} from 'typeorm';
import { InventoryBatch } from './entities/inventory-batch.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { StockMovementType } from '../common/enums';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryBatch)
    private batchRepo: Repository<InventoryBatch>,
    @InjectRepository(StockMovement)
    private movementRepo: Repository<StockMovement>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
    private dataSource: DataSource,
  ) {}

  // ─── Called when a purchase invoice is received ───────────────────────────

  async addBatch(
    storeId: string,
    menuItemId: string,
    quantity: number,
    unitCost: number,
    referenceId: string,
    em?: EntityManager,
  ): Promise<void> {
    const runner = em ?? this.dataSource.manager;

    const batch = runner.create(InventoryBatch, {
      store_id: storeId,
      menu_item_id: menuItemId,
      quantity,
      quantityRemaining: quantity,
      unitCost,
      receivedAt: new Date(),
      referenceId,
    });
    await runner.save(batch);

    await runner
      .createQueryBuilder()
      .update(MenuItem)
      .set({ stock: () => `stock + ${quantity}` })
      .where('id = :id', { id: menuItemId })
      .execute();

    const balance = await this.currentBalance(runner, storeId, menuItemId);
    await runner.save(
      runner.create(StockMovement, {
        store_id: storeId,
        menu_item_id: menuItemId,
        type: StockMovementType.PURCHASE,
        quantity,
        unitCost,
        balance,
        referenceId,
        referenceType: 'purchase_invoice',
      }),
    );
  }

  // ─── Called when an order is confirmed — deducts via FIFO ─────────────────

  async deductFifo(
    storeId: string,
    menuItemId: string,
    quantity: number,
    referenceId: string,
    em?: EntityManager,
  ): Promise<void> {
    const runner = em ?? this.dataSource.manager;

    const batches = await runner.find(InventoryBatch, {
      where: {
        store_id: storeId,
        menu_item_id: menuItemId,
        quantityRemaining: MoreThan(0),
      },
      order: { receivedAt: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });

    const totalAvailable = batches.reduce(
      (sum, b) => sum + Number(b.quantityRemaining),
      0,
    );

    if (totalAvailable < quantity) {
      const item = await this.menuItemRepo.findOne({ where: { id: menuItemId } });
      throw new BadRequestException(
        `Insufficient stock for "${item?.name ?? menuItemId}". Available: ${totalAvailable}, Required: ${quantity}`,
      );
    }

    let remaining = quantity;
    for (const batch of batches) {
      if (remaining <= 0) break;
      const deduct = Math.min(Number(batch.quantityRemaining), remaining);
      batch.quantityRemaining = Number(batch.quantityRemaining) - deduct;
      remaining -= deduct;
      await runner.save(batch);
    }

    await runner
      .createQueryBuilder()
      .update(MenuItem)
      .set({ stock: () => `stock - ${quantity}` })
      .where('id = :id', { id: menuItemId })
      .execute();

    const balance = totalAvailable - quantity;
    await runner.save(
      runner.create(StockMovement, {
        store_id: storeId,
        menu_item_id: menuItemId,
        type: StockMovementType.SALE,
        quantity: -quantity,
        balance,
        referenceId,
        referenceType: 'order',
      }),
    );
  }

  // ─── Called when a confirmed order is cancelled — returns stock ───────────

  async returnStock(
    storeId: string,
    menuItemId: string,
    quantity: number,
    referenceId: string,
    em?: EntityManager,
  ): Promise<void> {
    const runner = em ?? this.dataSource.manager;

    // Add a new batch with the returned stock (no cost — it's a return)
    const batch = runner.create(InventoryBatch, {
      store_id: storeId,
      menu_item_id: menuItemId,
      quantity,
      quantityRemaining: quantity,
      unitCost: 0,
      receivedAt: new Date(),
      referenceId,
    });
    await runner.save(batch);

    await runner
      .createQueryBuilder()
      .update(MenuItem)
      .set({ stock: () => `stock + ${quantity}` })
      .where('id = :id', { id: menuItemId })
      .execute();

    const balance = await this.currentBalance(runner, storeId, menuItemId);
    await runner.save(
      runner.create(StockMovement, {
        store_id: storeId,
        menu_item_id: menuItemId,
        type: StockMovementType.RETURN_IN,
        quantity,
        balance,
        referenceId,
        referenceType: 'order_cancellation',
      }),
    );
  }

  // ─── Manual stock adjustment ───────────────────────────────────────────────

  async adjustStock(
    storeId: string,
    menuItemId: string,
    quantity: number,
    notes?: string,
  ): Promise<void> {
    const item = await this.menuItemRepo.findOne({
      where: { id: menuItemId, store_id: storeId },
    });
    if (!item) throw new NotFoundException('Menu item not found in this store');

    await this.dataSource.transaction(async (em) => {
      if (quantity > 0) {
        const batch = em.create(InventoryBatch, {
          store_id: storeId,
          menu_item_id: menuItemId,
          quantity,
          quantityRemaining: quantity,
          unitCost: 0,
          receivedAt: new Date(),
        });
        await em.save(batch);
      } else if (quantity < 0) {
        const abs = Math.abs(quantity);
        const batches = await em.find(InventoryBatch, {
          where: { store_id: storeId, menu_item_id: menuItemId, quantityRemaining: MoreThan(0) },
          order: { receivedAt: 'ASC' },
          lock: { mode: 'pessimistic_write' },
        });
        const available = batches.reduce((s, b) => s + Number(b.quantityRemaining), 0);
        if (available < abs) throw new BadRequestException(`Cannot adjust: only ${available} in stock`);

        let remaining = abs;
        for (const batch of batches) {
          if (remaining <= 0) break;
          const deduct = Math.min(Number(batch.quantityRemaining), remaining);
          batch.quantityRemaining = Number(batch.quantityRemaining) - deduct;
          remaining -= deduct;
          await em.save(batch);
        }
      }

      await em
        .createQueryBuilder()
        .update(MenuItem)
        .set({ stock: () => `stock + ${quantity}` })
        .where('id = :id', { id: menuItemId })
        .execute();

      const balance = await this.currentBalance(em, storeId, menuItemId);
      await em.save(
        em.create(StockMovement, {
          store_id: storeId,
          menu_item_id: menuItemId,
          type: quantity >= 0 ? StockMovementType.ADJUSTMENT_IN : StockMovementType.ADJUSTMENT_OUT,
          quantity,
          balance,
          notes,
        }),
      );
    });
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  async getStockLevels(storeId: string) {
    return this.menuItemRepo.find({
      where: { store_id: storeId, isActive: true },
      select: ['id', 'name', 'sku', 'unit', 'stock', 'lowStockThreshold', 'isAvailable'],
    });
  }

  async getLowStockAlerts(storeId: string) {
    return this.menuItemRepo
      .createQueryBuilder('m')
      .where('m.store_id = :storeId', { storeId })
      .andWhere('m.isActive = true')
      .andWhere('m.stock <= m.lowStockThreshold')
      .andWhere('m.lowStockThreshold > 0')
      .orderBy('m.stock', 'ASC')
      .getMany();
  }

  async getMovements(storeId: string, menuItemId?: string) {
    const qb = this.movementRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.menuItem', 'item')
      .where('m.store_id = :storeId', { storeId })
      .orderBy('m.createdAt', 'DESC')
      .take(200);

    if (menuItemId) qb.andWhere('m.menu_item_id = :menuItemId', { menuItemId });
    return qb.getMany();
  }

  async getBatches(storeId: string, menuItemId: string) {
    return this.batchRepo.find({
      where: { store_id: storeId, menu_item_id: menuItemId, quantityRemaining: MoreThan(0) },
      order: { receivedAt: 'ASC' },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async currentBalance(
    em: EntityManager,
    storeId: string,
    menuItemId: string,
  ): Promise<number> {
    const result = await em
      .createQueryBuilder(InventoryBatch, 'b')
      .select('COALESCE(SUM(b.quantityRemaining), 0)', 'total')
      .where('b.store_id = :storeId AND b.menu_item_id = :menuItemId', { storeId, menuItemId })
      .getRawOne<{ total: string }>();
    return Number(result?.total ?? 0);
  }
}
