export interface PublicUser {
  id: string;
  auth_user_id: string;
  name: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN";
}
