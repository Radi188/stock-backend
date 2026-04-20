import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(user: {
        id: string;
    }): Promise<{
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
}
