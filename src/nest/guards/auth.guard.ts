import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from './roles.guard';
import { UnauthorizedError } from '../exceptions/unauthorized.exception';
import { BasicAuth, checkTokenPayload } from '../common/auth/basic-auth';
import { AuthUserInterceptor } from '../interceptors/auth-user.interceptor';
import { LanguageInterceptor } from '../interceptors/language.interceptor';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() { }

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeaders = request.headers['authorization'] || '';
      const token = authHeaders.split(' ')[1];

      if (!token) {
        throw new UnauthorizedError({ message: 'common.TOKEN_INVALID' });
      }

      const decoded = BasicAuth.verifyToken(token);

      if (!decoded || !checkTokenPayload(decoded)) {
        throw new UnauthorizedError({ message: 'common.TOKEN_INVALID' });
      }

      request.user = decoded;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError({
          message: 'common.TOKEN_EXPIRED',
          name: 'expired_token',
          subCode: 423,
        });
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError({ message: 'common.TOKEN_INVALID' });
      } else if (err.name === 'NotBeforeError') {
        throw new UnauthorizedError({ message: 'common.TOKEN_INVALID_TTL' });
      } else {
        throw err;
      }
    }
  }
}

export function ApplyAuthGuard() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(AuthGuard, RolesGuard),
    UseInterceptors(AuthUserInterceptor, LanguageInterceptor),
  );
}
