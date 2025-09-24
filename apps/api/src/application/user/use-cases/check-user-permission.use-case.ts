import { Inject, Injectable } from "@nestjs/common";
import { UserSyncRepository } from "../interfaces/user-sync.repository";
import { PermissionRepository } from "../../../infra/user/repositories/permission.repository";

export interface CheckUserPermissionRequest {
  authUserId: string;
  requiredRole: string;
}

@Injectable()
export class CheckUserPermissionUseCase {
  public constructor(
    @Inject("UserSyncRepository")
    private readonly userSyncRepository: UserSyncRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  public async execute(request: CheckUserPermissionRequest): Promise<boolean> {
    const customUser = await this.userSyncRepository.findCustomUserByAuthId(
      request.authUserId,
    );
    if (!customUser) {
      return false;
    }
    return this.permissionRepository.hasRoleOrHigher(
      customUser.role,
      request.requiredRole,
    );
  }
}
