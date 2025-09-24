import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as DomainUser } from "../../domain/entities/user.entity";
import type { PublicUser } from "../../domain/entities/public-user.entity";
import type { UserResponseDto } from "../dto/user/auth-response.dto";

export class UserMapper {
  public static fromSupabase(user: SupabaseUser | null): UserResponseDto {
    return {
      id: user?.id ?? "",
      email: user?.email ?? "",
      name: user?.user_metadata?.name || user?.user_metadata?.full_name,
      role: user?.user_metadata?.role || "USER",
    } as UserResponseDto;
  }

  public static fromSupabaseWithPublicData(
    supabaseUser: SupabaseUser | null,
    publicUser: PublicUser,
  ): UserResponseDto {
    return {
      id: supabaseUser?.id ?? "",
      email: supabaseUser?.email ?? "",
      name:
        publicUser.name ||
        supabaseUser?.user_metadata?.name ||
        supabaseUser?.user_metadata?.full_name ||
        "Usuário",
      role: publicUser.role,
    } as UserResponseDto;
  }

  public static fromDomain(user: DomainUser): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    } as UserResponseDto;
  }
}
