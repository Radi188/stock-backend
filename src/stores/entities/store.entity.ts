import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('stores')
export class Store extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  googleMapsEmbed: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.stores)
  users: User[];

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];

  @OneToMany(() => Supplier, (supplier) => supplier.store)
  suppliers: Supplier[];

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];
}
