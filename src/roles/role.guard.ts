import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { Role } from './role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new HttpException(
        { info: false, message: 'Unauthorized', data: null },
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log(
      'requiredRoles.includes(request.user.role)',
      requiredRoles.includes(request.user.role),
    );
    //return requiredRoles.some((role) => request.user.role?.includes(role));
    if (!requiredRoles.includes(request.user.role)) {
      throw new HttpException(
        { info: false, message: 'not allow to access this route!', data: null },
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
