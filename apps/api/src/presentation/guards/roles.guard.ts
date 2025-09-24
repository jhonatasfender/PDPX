import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Inject } from "@nestjs/common";
import { UserSyncRepository } from "../../application/user/interfaces/user-sync.repository";
import { PermissionRepository } from "../../infra/user/repositories/permission.repository";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject("UserSyncRepository")
    private readonly userSyncRepository: UserSyncRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      "roles",
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authUserId = request.user?.sub || request.user?.id;

    if (!authUserId) {
      throw new ForbiddenException("Usuário não autenticado");
    }

    const customUser =
      await this.userSyncRepository.findCustomUserByAuthId(authUserId);

    if (!customUser) {
      throw new ForbiddenException("Usuário não encontrado no sistema");
    }

    const userRole = customUser.role as UserRole;

    const hasRole = requiredRoles.some((role) =>
      this.permissionRepository.hasRoleOrHigher(userRole, role),
    );

    if (!hasRole) {
      throw new ForbiddenException({
        message: "Acesso negado. Permissões insuficientes.",
        error: "INSUFFICIENT_PERMISSIONS",
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
}
