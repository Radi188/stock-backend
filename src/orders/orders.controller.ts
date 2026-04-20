import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreContextGuard } from '../common/guards/store-context.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StoreId } from '../common/decorators/store-id.decorator';
import { OrderStatus } from '../common/enums';

@UseGuards(JwtAuthGuard, StoreContextGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @StoreId() storeId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.ordersService.create(storeId, user.id, dto);
  }

  @Get()
  findAll(@StoreId() storeId: string) {
    return this.ordersService.findAll(storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @StoreId() storeId: string) {
    return this.ordersService.findOne(id, storeId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @StoreId() storeId: string,
  ) {
    return this.ordersService.updateStatus(id, storeId, dto.status as OrderStatus);
  }
}
