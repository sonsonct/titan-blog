import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleScope } from '../../commons/enums';
import { ForbiddenError } from '../exceptions/forbidden.exception';
import { TokenPayloadModel } from '../common/auth/basic-auth';
import { ROLES_KEY } from '../decorators/set-roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext) {
    try {
      // Get required roles of current API
      const apiRoles = this.reflector.get<RoleScope[]>(ROLES_KEY, context.getHandler());

      // Check if (no required roles)
      if (!apiRoles || apiRoles.length === 0) {
        return true;
      }

      // Get authenticated user data
      const request = context.switchToHttp().getRequest();
      const user = <TokenPayloadModel>request.user;


      // Check if current user role in required roles
      if (apiRoles.includes(user.role as RoleScope)) {
        return true;
      }

      throw new ForbiddenError({ message: 'common.TOKEN_INVALID' });
    } catch (err) {
      throw err;
    }
  }
}
