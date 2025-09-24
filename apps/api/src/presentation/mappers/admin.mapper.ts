import type { User } from "../../domain/entities/user.entity";
import { UserMapper } from "./user.mapper";
import type { UpdateUserRoleResponseDto } from "../dto/admin/admin-response.dto";

export class AdminMapper {
  public static toUpdateUserRoleResponse(
    updatedBy: User,
    targetUserId: string,
    newRole: string,
  ): UpdateUserRoleResponseDto {
    return {
      message: "Role alterado com sucesso",
      updatedBy: UserMapper.fromDomain(updatedBy),
      targetUser: {
        id: targetUserId,
        newRole,
      },
    };
  }
}
