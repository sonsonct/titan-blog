import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ContextProvider } from '../common/provider/context.provider';
import { TokenPayloadModel } from '../common/auth/basic-auth';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <TokenPayloadModel>request.user;

    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
