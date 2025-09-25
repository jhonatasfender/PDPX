import { UserRole } from "@prisma/client";

export interface PublicUser {
  id: string;
  auth_user_id: string;
  name: string | null;
  role: UserRole;
}
