import { BaseEntity } from '../../common/base.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { Category } from '../../categories/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class MenuItem extends BaseEntity {
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    lowStockThreshold: number;
    unit: string;
    sku: string;
    sortOrder: number;
    isActive: boolean;
    isAvailable: boolean;
    store: Store;
    store_id: string;
    category: Category;
    category_id: string;
    subcategory: Subcategory;
    subcategory_id: string;
}
