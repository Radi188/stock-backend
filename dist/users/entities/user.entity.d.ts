import { BaseEntity } from '../../common/base.entity';
import { UserRole } from '../../common/enums';
import { Store } from '../../stores/entities/store.entity';
export declare class User extends BaseEntity {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    stores: Store[];
}
