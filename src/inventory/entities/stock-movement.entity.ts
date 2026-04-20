import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { Store } from '../../stores/entities/store.entity';
import { StockMovementType } from '../../common/enums';

@Entity('stock_movements')
@Index(['store_id', 'menu_item_id'])
export class StockMovement extends BaseEntity {
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

  @Column({ type: 'enum', enum: StockMovementType })
  type: StockMovementType;

  /** Positive = stock in, Negative = stock out */
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number;

  /** Unit cost at the time of movement (relevant for PURCHASE) */
  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  unitCost: number;

  /** Stock balance after this movement */
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  balance: number;

  /** order_id, purchase_invoice_id, etc. */
  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true })
  referenceType: string;

  @Column({ nullable: true })
  notes: string;
}
