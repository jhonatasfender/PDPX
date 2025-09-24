import type { UserResponseDto } from "../user/auth-response.dto";

export interface UpdateUserRoleResponseDto {
  message: string;
  updatedBy: UserResponseDto;
  targetUser: {
    id: string;
    newRole: string;
  };
}


