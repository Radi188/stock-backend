import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StoreContextGuard } from '../common/guards/store-context.guard';
import { StoreId } from '../common/decorators/store-id.decorator';

@UseGuards(JwtAuthGuard, StoreContextGuard)
@Controller('purchase-invoices')
export class PurchaseInvoicesController {
  constructor(private service: PurchaseInvoicesService) {}

  @Post()
  create(@Body() dto: CreatePurchaseInvoiceDto, @StoreId() storeId: string) {
    return this.service.create(storeId, dto);
  }

  @Get()
  findAll(@StoreId() storeId: string) {
    return this.service.findAll(storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @StoreId() storeId: string) {
    return this.service.findOne(id, storeId);
  }

  /** Mark invoice as received → triggers FIFO stock addition */
  @Patch(':id/receive')
  receive(@Param('id') id: string, @StoreId() storeId: string) {
    return this.service.receive(id, storeId);
  }
}
