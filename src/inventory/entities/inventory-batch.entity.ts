import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('inventory_batches')
@Index(['store_id', 'menu_item_id'])
export class InventoryBatch extends BaseEntity {
  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_id: string;

  @ManyToOne(() => MenuItem)
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column()
  menu_item_id: string;

  /** Original quantity received in this batch */
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number;

  /** Remaining quantity — decremented by FIFO deductions */
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantityRemaining: number;

  /** Cost per unit when received (used for COGS) */
  @Column({ type: 'decimal', precision: 10, scale: 4 })
  unitCost: number;

  /** Timestamp used for FIFO ordering — oldest batch consumed first */
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  receivedAt: Date;

  /** ID of the purchase invoice item that created this batch */
  @Column({ nullable: true })
  referenceId: string;
}
