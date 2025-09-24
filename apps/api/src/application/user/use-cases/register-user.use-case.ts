import { Injectable, Inject } from "@nestjs/common";
import { User, Session } from "@supabase/supabase-js";
import { TokenService } from "../interfaces/token.interface";
import { UserSyncRepository } from "../interfaces/user-sync.repository";
import { UserAlreadyExistsException } from "../../../domain/exceptions/user-exceptions";

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserResponse {
  user: User | null;
  session: Session | null;
}

@Injectable()
export class RegisterUserUseCase {
  public constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserSyncRepository")
    private readonly userSyncRepository: UserSyncRepository,
  ) {}

  public async execute(
    request: RegisterUserRequest,
  ): Promise<RegisterUserResponse> {
    const userExists = await this.tokenService.checkUserExists(request.email);
    if (userExists) {
      throw new UserAlreadyExistsException(request.email);
    }

    const authResponse = await this.tokenService.signUp(
      request.email,
      request.password,
    );
    if (!authResponse.user) {
      throw new Error("Falha ao criar usuário");
    }

    try {
      await this.userSyncRepository.syncUserFromAuth(authResponse.user.id, request.name);
    } catch (error) {
      console.error("Erro ao sincronizar usuário:", error);
    }

    return {
      user: authResponse.user,
      session: authResponse.session,
    };
  }
}
