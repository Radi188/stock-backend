import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const StoreId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest().storeId;
  },
);
