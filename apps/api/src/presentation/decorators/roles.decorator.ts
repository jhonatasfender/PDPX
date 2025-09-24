import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../domain/user/value-objects/role.vo";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const RequireUser = () => Roles(UserRole.USER);
export const RequireAdmin = () => Roles(UserRole.ADMIN, UserRole.SUPERADMIN);
export const RequireSuperAdmin = () => Roles(UserRole.SUPERADMIN);
