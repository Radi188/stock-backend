import { Global, Module } from '@nestjs/common';
import { StoreContextGuard } from './store-context.guard';

@Global()
@Module({
  providers: [StoreContextGuard],
  exports: [StoreContextGuard],
})
export class StoreContextModule {}
