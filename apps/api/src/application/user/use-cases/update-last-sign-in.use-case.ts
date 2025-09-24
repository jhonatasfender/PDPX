import { Injectable } from "@nestjs/common";
import { AuthUserRepository } from "../../../infra/user/repositories/auth-user.repository";

export interface UpdateLastSignInRequest {
  authUserId: string;
}

@Injectable()
export class UpdateLastSignInUseCase {
  public constructor(private readonly authUserRepository: AuthUserRepository) {}

  public async execute(request: UpdateLastSignInRequest): Promise<void> {
    await this.authUserRepository.updateLastSignIn(request.authUserId);
  }
}
