import { BaseEntity } from '../../common/base.entity';
import { Store } from '../../stores/entities/store.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
export declare class Category extends BaseEntity {
    name: string;
    description: string;
    image: string;
    sortOrder: number;
    isActive: boolean;
    store: Store;
    store_id: string;
    subcategories: Subcategory[];
}
