import { BaseEntity } from '../../common/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
export declare class Subcategory extends BaseEntity {
    name: string;
    description: string;
    image: string;
    sortOrder: number;
    isActive: boolean;
    category: Category;
    category_id: string;
    menuItems: MenuItem[];
}
