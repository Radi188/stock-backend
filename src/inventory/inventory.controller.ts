import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreContextGuard } from '../common/guards/store-context.guard';
import { StoreId } from '../common/decorators/store-id.decorator';

class AdjustStockDto {
  menuItemId: string;
  quantity: number;
  notes?: string;
}

@UseGuards(JwtAuthGuard, StoreContextGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  /** Current stock levels for all items in the store */
  @Get('stock-levels')
  getStockLevels(@StoreId() storeId: string) {
    return this.inventoryService.getStockLevels(storeId);
  }

  /** Items at or below their low-stock threshold */
  @Get('low-stock')
  getLowStockAlerts(@StoreId() storeId: string) {
    return this.inventoryService.getLowStockAlerts(storeId);
  }

  /** Full movement history — optionally filtered by item */
  @Get('movements')
  getMovements(
    @StoreId() storeId: string,
    @Query('menuItemId') menuItemId?: string,
  ) {
    return this.inventoryService.getMovements(storeId, menuItemId);
  }

  /** FIFO batches remaining for a specific item */
  @Get(':menuItemId/batches')
  getBatches(
    @Param('menuItemId') menuItemId: string,
    @StoreId() storeId: string,
  ) {
    return this.inventoryService.getBatches(storeId, menuItemId);
  }

  /** Manual stock adjustment (positive = add, negative = remove) */
  @Post('adjust')
  adjustStock(@Body() dto: AdjustStockDto, @StoreId() storeId: string) {
    return this.inventoryService.adjustStock(
      storeId,
      dto.menuItemId,
      dto.quantity,
      dto.notes,
    );
  }
}
