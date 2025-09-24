import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as DomainUser } from "../../domain/entities/user.entity";
import type { UserResponseDto } from "../dto/user/auth-response.dto";

export class UserMapper {
  public static fromSupabase(user: SupabaseUser | null): UserResponseDto {
    return {
      id: user?.id ?? "",
      email: user?.email ?? "",
      name:
        (user as any)?.user_metadata?.name ||
        (user as any)?.user_metadata?.full_name,
      role: ((user as any)?.user_metadata?.role as any) || ("USER" as any),
    } as UserResponseDto;
  }

  public static fromDomain(user: DomainUser): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    } as UserResponseDto;
  }
}
