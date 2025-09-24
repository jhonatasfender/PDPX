import { Injectable, Inject } from "@nestjs/common";
import { Session } from "@supabase/supabase-js";
import { TokenService } from "../interfaces/token.interface";

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  session: Session | null;
}

@Injectable()
export class RefreshTokenUseCase {
  public constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
  ) {}

  public async execute(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    try {
      const authResponse = await this.tokenService.refreshSession(
        request.refreshToken,
      );

      if (!authResponse.session) {
        throw new Error("Refresh token inválido");
      }

      return {
        session: authResponse.session,
      };
    } catch (error) {
      throw new Error("Refresh token inválido");
    }
  }
}
