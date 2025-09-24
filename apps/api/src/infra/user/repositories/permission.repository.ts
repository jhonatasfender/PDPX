import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionRepository {
  public hasRoleOrHigher(currentRole: string, requiredRole: string): boolean {
    const hierarchy: Record<string, number> = {
      USER: 1,
      ADMIN: 2,
      SUPERADMIN: 3,
    };
    return (hierarchy[currentRole] || 0) >= (hierarchy[requiredRole] || 0);
  }
}
