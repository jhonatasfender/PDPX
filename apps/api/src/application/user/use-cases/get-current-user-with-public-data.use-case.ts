import { Injectable, Inject } from "@nestjs/common";
import { User } from "@supabase/supabase-js";
import { TokenService } from "../interfaces/token.interface";
import { UserSyncRepository } from "../interfaces/user-sync.repository";
import { PublicUser } from "../../../domain/entities/public-user.entity";

export interface GetCurrentUserWithPublicDataRequest {
  token: string;
}

export interface GetCurrentUserWithPublicDataResponse {
  user: User;
  publicUser: PublicUser;
}

@Injectable()
export class GetCurrentUserWithPublicDataUseCase {
  public constructor(
    @Inject("TokenService") private readonly tokenService: TokenService,
    @Inject("UserSyncRepository") private readonly userSyncRepository: UserSyncRepository,
  ) {}

  public async execute(
    request: GetCurrentUserWithPublicDataRequest,
  ): Promise<GetCurrentUserWithPublicDataResponse> {
    const user = await this.tokenService.verifyAccessToken(request.token);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const publicUser = await this.userSyncRepository.findCustomUserByAuthId(user.id);

    if (!publicUser) {
      throw new Error("Usuário não encontrado na tabela pública");
    }

    return { user, publicUser };
  }
}
