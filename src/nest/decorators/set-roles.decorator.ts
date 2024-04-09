import { SetMetadata } from '@nestjs/common';
import { RoleScope } from '../../commons/enums';

export const ROLES_KEY = Symbol('roles');

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SetRoles = (...roles: RoleScope[]) => SetMetadata(ROLES_KEY, roles);
