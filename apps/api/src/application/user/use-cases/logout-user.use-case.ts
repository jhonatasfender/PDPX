import { Injectable, Inject } from "@nestjs/common";
import { TokenService } from "../interfaces/token.interface";

export interface LogoutUserRequest {
  token: string;
}

export interface LogoutUserResponse {
  success: boolean;
}

@Injectable()
export class LogoutUserUseCase {
  public constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
  ) {}

  public async execute(
    request: LogoutUserRequest,
  ): Promise<LogoutUserResponse> {
    try {
      await this.tokenService.signOut();

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: true,
      };
    }
  }
}
