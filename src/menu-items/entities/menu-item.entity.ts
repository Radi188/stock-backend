import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { Category } from '../../categories/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('menu_items')
export class MenuItem extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  store_id: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ nullable: true })
  category_id: string;

  @ManyToOne(() => Subcategory, (sub) => sub.menuItems, { nullable: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;

  @Column({ nullable: true })
  subcategory_id: string;
}
