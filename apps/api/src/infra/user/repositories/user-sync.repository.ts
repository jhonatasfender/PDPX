import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import {
  UserSyncRepository,
  UserWithAuthData,
} from "../../../application/user/interfaces/user-sync.repository";
import { PublicUser } from "../../../domain/entities/public-user.entity";

@Injectable()
export class UserSyncRepositoryImpl implements UserSyncRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async syncUserFromAuth(authUserId: string, customName?: string): Promise<PublicUser> {
    const authUser = await this.prisma.auth_users.findUnique({
      where: { id: authUserId },
      include: {
        identities: true,
        sessions: true,
      },
    });

    if (!authUser) {
      throw new Error("Usuário não encontrado no Supabase Auth");
    }

    const existingUser = await this.findCustomUserByAuthId(authUserId);

    if (existingUser) {
      return existingUser;
    } else {
      const extractedName = customName || this.extractNameFromAuthUser(authUser);
      return await this.createCustomUser({
        auth_user_id: authUserId,
        role: "USER",
        name: extractedName,
      });
    }
  }

  public async getUserWithAuthData(userId: string): Promise<UserWithAuthData> {
    const customUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!customUser) {
      throw new Error("Usuário customizado não encontrado");
    }

    const authUser = await this.prisma.auth_users.findUnique({
      where: { id: customUser.auth_user_id },
      include: {
        identities: true,
        sessions: true,
      },
    });

    return {
      custom: customUser as PublicUser,
      auth: authUser as UserWithAuthData['auth'],
    };
  }

  public async getUserByEmail(email: string): Promise<UserWithAuthData | null> {
    const authUser = await this.prisma.auth_users.findFirst({
      where: { email },
      include: {
        identities: true,
        sessions: true,
      },
    });

    if (!authUser) {
      return null;
    }

    const customUser = await this.findCustomUserByAuthId(authUser.id);

    if (!customUser) {
      return null;
    }

    return {
      custom: customUser,
      auth: authUser as UserWithAuthData['auth'],
    };
  }

  public async findCustomUserByAuthId(authUserId: string): Promise<PublicUser | null> {
    return await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
    });
  }

  public async createCustomUser(data: {
    auth_user_id: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
    name?: string;
  }): Promise<PublicUser> {
    return await this.prisma.users.create({
      data: {
        auth_user_id: data.auth_user_id,
        role: data.role,
        name: data.name,
      },
    });
  }

  public async updateCustomUser(
    authUserId: string,
    data: {
      role?: "USER" | "ADMIN" | "SUPERADMIN";
      name?: string;
    },
  ): Promise<PublicUser> {
    return await this.prisma.users.update({
      where: { auth_user_id: authUserId },
      data: {
        ...data,
      },
    });
  }

  public async updateUserRole(
    authUserId: string,
    role: "USER" | "ADMIN" | "SUPERADMIN",
  ): Promise<PublicUser> {
    return await this.prisma.users.update({
      where: { auth_user_id: authUserId },
      data: { role },
    });
  }

  public async getAllUsersWithAuthData(): Promise<UserWithAuthData[]> {
    const customUsers = await this.prisma.users.findMany({
      orderBy: { auth_user_id: "desc" },
    });

    const usersWithAuth = await Promise.all(
      customUsers.map(async (user) => {
        const authUser = await this.prisma.auth_users.findUnique({
          where: { id: user.auth_user_id },
          include: {
            identities: true,
          },
        });

        return {
          custom: user as PublicUser,
          auth: authUser as UserWithAuthData['auth'],
        };
      }),
    );

    return usersWithAuth;
  }

  private extractNameFromAuthUser(authUser: {
    raw_user_meta_data?: unknown;
    email?: string | null;
    identities?: Array<{
      identity_data?: unknown;
    }>;
  }): string {
    if (authUser.raw_user_meta_data && typeof authUser.raw_user_meta_data === 'object' && authUser.raw_user_meta_data !== null) {
      const metaData = authUser.raw_user_meta_data as Record<string, unknown>;
      if (metaData.name && typeof metaData.name === 'string') {
        return metaData.name;
      }
    }

    if (authUser.email) {
      return authUser.email.split("@")[0];
    }

    if (authUser.identities && authUser.identities.length > 0) {
      const identity = authUser.identities[0];
      if (identity.identity_data && typeof identity.identity_data === 'object' && identity.identity_data !== null) {
        const identityData = identity.identity_data as Record<string, unknown>;
        if (identityData.name && typeof identityData.name === 'string') {
          return identityData.name;
        }
        if (identityData.full_name && typeof identityData.full_name === 'string') {
          return identityData.full_name;
        }
      }
    }

    return "Usuário";
  }
}
