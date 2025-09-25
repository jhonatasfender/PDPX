import { PublicUser } from "../../../domain/entities/public-user.entity";
import { $Enums } from "@prisma/client";

export interface UserWithAuthData {
  custom: PublicUser;
  auth: {
    id: string;
    email: string | null;
    email_confirmed_at: Date | null;
    last_sign_in_at: Date | null;
    raw_user_meta_data: unknown;
    identities: Array<{
      provider: string;
      identity_data: unknown;
    }>;
  } | null;
}

export interface UserSyncRepository {
  syncUserFromAuth(
    authUserId: string,
    customName?: string,
  ): Promise<PublicUser>;
  getUserWithAuthData(userId: string): Promise<UserWithAuthData>;
  getUserByEmail(email: string): Promise<UserWithAuthData | null>;
  updateUserRole(authUserId: string, role: $Enums.UserRole): Promise<PublicUser>;
  getAllUsersWithAuthData(): Promise<UserWithAuthData[]>;
  findCustomUserByAuthId(authUserId: string): Promise<PublicUser | null>;
  createCustomUser(data: {
    auth_user_id: string;
    name?: string;
  }): Promise<PublicUser>;
  updateCustomUser(
    authUserId: string,
    data: {
      role?: $Enums.UserRole;
      name?: string;
    },
  ): Promise<PublicUser>;
}
