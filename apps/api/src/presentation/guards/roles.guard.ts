import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../infra/prisma/prisma.service';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authUserId = request.user?.sub || request.user?.id;

    if (!authUserId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const customUser = await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
    });

    if (!customUser) {
      throw new ForbiddenException('Usuário não encontrado no sistema');
    }

    const userRole = customUser.role as UserRole;
    
    const hasRole = requiredRoles.some((role) => {
      return this.hasPermission(userRole, role);
    });

    if (!hasRole) {
      throw new ForbiddenException({
        message: 'Acesso negado. Permissões insuficientes.',
        error: 'INSUFFICIENT_PERMISSIONS',
        statusCode: 403,
        details: {
          requiredRoles,
          userRole,
          authUserId,
        },
      });
    }

    request.customUser = customUser;

    return true;
  }

  private hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPERADMIN]: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}
