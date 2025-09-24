import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { UserSyncRepository } from "../interfaces/user-sync.repository";
import { AuthUserRepository } from "../../../infra/user/repositories/auth-user.repository";
import { PermissionRepository } from "../../../infra/user/repositories/permission.repository";

export interface AuthenticateUserRequest {
  email: string;
  password?: string;
  provider?: string;
  providerId?: string;
}

export interface AuthenticateUserResponse {
  user: {
    id: string;
    role: string;
    authUserId: string;
  };
  authData: {
    email: string | null;
    emailConfirmed: boolean;
    lastSignIn: Date | null;
    providers: string[];
  };
}

@Injectable()
export class AuthenticateUserUseCase {
  public constructor(
    private readonly prisma: PrismaService,
    @Inject("UserSyncRepository")
    private readonly userSyncRepository: UserSyncRepository,
    private readonly authUserQuery: AuthUserRepository,
    private readonly permissionService: PermissionRepository,
  ) {}

  public async execute(
    request: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse | null> {
    const authUser = await this.findAuthUser(request);

    if (!authUser) {
      return null;
    }

    const customUser = await this.userSyncRepository.syncUserFromAuth(
      authUser.id,
    );

    const providers =
      authUser.identities?.map((identity: any) => identity.provider) || [];

    return {
      user: {
        id: customUser.id,
        role: customUser.role,
        authUserId: authUser.id,
      },
      authData: {
        email: authUser.email,
        emailConfirmed: !!authUser.email_confirmed_at,
        lastSignIn: authUser.last_sign_in_at,
        providers,
      },
    };
  }

  private async findAuthUser(
    request: AuthenticateUserRequest,
  ): Promise<any | null> {
    if (request.provider && request.providerId) {
      return await this.authUserQuery.findByProvider(
        request.provider,
        request.providerId,
      );
    }

    if (request.email) {
      return await this.authUserQuery.findByEmail(request.email);
    }

    return null;
  }
}
