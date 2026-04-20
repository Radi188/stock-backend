import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepo;
    private jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        role: import("../common/enums").UserRole;
        stores: {
            id: string;
            name: string;
            logo: string;
        }[];
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            phone: string;
            email: string;
            role: import("../common/enums").UserRole;
            stores: {
                id: string;
                name: string;
                logo: string;
            }[];
        };
    }>;
}
