export interface UserWithAuthData {
  custom: {
    id: string;
    auth_user_id: string;
    role: string;
  };
  auth: {
    id: string;
    email: string | null;
    email_confirmed_at: Date | null;
    last_sign_in_at: Date | null;
    raw_user_meta_data: any;
    identities: Array<{
      provider: string;
      identity_data: any;
    }>;
  } | null;
}

export interface UserSyncRepository {
  syncUserFromAuth(authUserId: string): Promise<any>;
  getUserWithAuthData(userId: string): Promise<UserWithAuthData>;
  getUserByEmail(email: string): Promise<UserWithAuthData | null>;
  updateUserRole(
    authUserId: string,
    role: "USER" | "ADMIN" | "SUPERADMIN",
  ): Promise<any>;
  getAllUsersWithAuthData(): Promise<UserWithAuthData[]>;
  findCustomUserByAuthId(authUserId: string): Promise<any>;
  createCustomUser(data: {
    auth_user_id: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
  }): Promise<any>;
  updateCustomUser(
    authUserId: string,
    data: {
      role?: "USER" | "ADMIN" | "SUPERADMIN";
    },
  ): Promise<any>;
}
