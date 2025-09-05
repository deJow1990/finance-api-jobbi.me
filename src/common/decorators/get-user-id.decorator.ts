import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as { userId: string } | undefined;
  if (!user?.userId) throw new UnauthorizedException();
  return user.userId;
});