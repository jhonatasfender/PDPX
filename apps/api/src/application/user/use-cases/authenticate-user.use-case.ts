import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { UserSyncRepository } from '../interfaces/user-sync.repository';

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
  constructor(
    private readonly prisma: PrismaService,
    @Inject('UserSyncRepository')
    private readonly userSyncRepository: UserSyncRepository,
  ) {}

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse | null> {
    let authUser;

    if (request.provider && request.providerId) {
      authUser = await this.findUserByProvider(request.provider, request.providerId);
    } else if (request.email) {
      authUser = await this.prisma.auth_users.findFirst({
        where: { email: request.email },
        include: {
          identities: true,
        },
      });
    }

    if (!authUser) {
      return null;
    }

    const customUser = await this.userSyncRepository.syncUserFromAuth(authUser.id);

    const providers = authUser.identities?.map((identity: any) => identity.provider) || [];

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

  private async findUserByProvider(provider: string, providerId: string): Promise<any> {
    const identity = await this.prisma.auth_identities.findFirst({
      where: {
        provider,
        provider_id: providerId,
      },
      include: {
        users: true,
      },
    });

    return identity?.users || null;
  }

  async checkUserPermission(authUserId: string, requiredRole: string): Promise<boolean> {
    const customUser = await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
    });

    if (!customUser) {
      return false;
    }

    const roleHierarchy: Record<string, number> = {
      USER: 1,
      ADMIN: 2,
      SUPERADMIN: 3,
    };

    const userLevel = roleHierarchy[customUser.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  async updateLastSignIn(authUserId: string): Promise<void> {
    await this.prisma.auth_users.update({
      where: { id: authUserId },
      data: { last_sign_in_at: new Date() },
    });
  }
}
