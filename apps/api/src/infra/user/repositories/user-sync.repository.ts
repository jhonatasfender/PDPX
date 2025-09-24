import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import {
  UserSyncRepository,
  UserWithAuthData,
} from "../../../application/user/interfaces/user-sync.repository";

@Injectable()
export class UserSyncRepositoryImpl implements UserSyncRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async syncUserFromAuth(authUserId: string): Promise<any> {
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
      return await this.createCustomUser({
        auth_user_id: authUserId,
        role: "USER",
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
      custom: customUser,
      auth: authUser,
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

    return {
      custom: customUser,
      auth: authUser,
    };
  }

  public async findCustomUserByAuthId(authUserId: string): Promise<any> {
    return await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
    });
  }

  public async createCustomUser(data: {
    auth_user_id: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
  }): Promise<any> {
    return await this.prisma.users.create({
      data: {
        auth_user_id: data.auth_user_id,
        role: data.role,
      },
    });
  }

  public async updateCustomUser(
    authUserId: string,
    data: {
      role?: "USER" | "ADMIN" | "SUPERADMIN";
    },
  ): Promise<any> {
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
  ): Promise<any> {
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
      customUsers.map(async (user: typeof customUsers[0]) => {
        const authUser = await this.prisma.auth_users.findUnique({
          where: { id: user.auth_user_id },
          include: {
            identities: true,
          },
        });

        return {
          custom: user,
          auth: authUser,
        };
      }),
    );

    return usersWithAuth;
  }

  private extractNameFromAuthUser(authUser: any): string {
    if (authUser.raw_user_meta_data?.name) {
      return authUser.raw_user_meta_data.name;
    }

    if (authUser.email) {
      return authUser.email.split("@")[0];
    }

    if (authUser.identities?.length > 0) {
      const identity = authUser.identities[0];
      if (identity.identity_data?.name) {
        return identity.identity_data.name;
      }
      if (identity.identity_data?.full_name) {
        return identity.identity_data.full_name;
      }
    }

    return "Usuário";
  }
}
