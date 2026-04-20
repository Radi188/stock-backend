import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRole } from '../enums';

@Injectable()
export class StoreContextGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const storeId = request.headers['x-store-id'] as string;

    if (!storeId) {
      throw new BadRequestException('x-store-id header is required');
    }

    // Admins can access any store without a membership check
    if (request.user?.role === UserRole.ADMIN) {
      request.storeId = storeId;
      return true;
    }

    const rows = await this.dataSource.query(
      `SELECT 1 FROM user_stores WHERE user_id = $1 AND store_id = $2`,
      [request.user.id, storeId],
    );

    if (!rows.length) {
      throw new ForbiddenException('You do not have access to this store');
    }

    request.storeId = storeId;
    return true;
  }
}
