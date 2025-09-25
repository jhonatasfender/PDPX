import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import {
  UserSyncRepository,
  UserWithAuthData,
} from "../../../application/user/interfaces/user-sync.repository";
import { PublicUser } from "../../../domain/entities/public-user.entity";
import { UserRole as DbUserRole } from "@prisma/client";

@Injectable()
export class UserSyncRepositoryImpl implements UserSyncRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async syncUserFromAuth(
    authUserId: string,
    customName?: string,
  ): Promise<PublicUser> {
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
      await this.upsertUserProfileForUser(
        existingUser.id,
        existingUser.name ?? undefined,
        existingUser.role as DbUserRole,
      );
      return existingUser;
    } else {
      const extractedName =
        customName || this.extractNameFromAuthUser(authUser);
      const created = await this.createCustomUser({
        auth_user_id: authUserId,
        name: extractedName,
      });
      await this.upsertUserProfileForUser(
        created.id,
        extractedName,
        DbUserRole.USER,
      );
      return created;
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
      auth: authUser as UserWithAuthData["auth"],
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
      auth: authUser as UserWithAuthData["auth"],
    };
  }

  public async findCustomUserByAuthId(
    authUserId: string,
  ): Promise<PublicUser | null> {
    const row = await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
      select: { id: true, auth_user_id: true, name: true },
    });
    if (!row) return null;
    const profile = await this.prisma.user_profiles.findUnique({
      where: { user_id: row.id },
      select: { role: true },
    });
    return this.toPublicUser({
      id: row.id,
      auth_user_id: row.auth_user_id,
      name: row.name,
      role: profile?.role ?? DbUserRole.USER,
    });
  }

  public async createCustomUser(data: {
    auth_user_id: string;
    name?: string;
  }): Promise<PublicUser> {
    const row = await this.prisma.users.create({
      data: {
        auth_user_id: data.auth_user_id,
        name: data.name,
      },
      select: { id: true, auth_user_id: true, name: true },
    });
    return this.toPublicUser({ ...row, role: DbUserRole.USER });
  }

  public async updateCustomUser(
    authUserId: string,
    data: {
      role?: DbUserRole;
      name?: string;
    },
  ): Promise<PublicUser> {
    const updated = await this.prisma.users.update({
      where: { auth_user_id: authUserId },
      data: {
        name: data.name,
      },
      select: { id: true, auth_user_id: true, name: true },
    });
    await this.upsertUserProfileForAuthUser(authUserId, data.name, data.role);
    return this.toPublicUser({
      ...updated,
      role: data.role ?? DbUserRole.USER,
    });
  }

  public async updateUserRole(
    authUserId: string,
    role: DbUserRole,
  ): Promise<PublicUser> {
    const updated = await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
      select: { id: true, auth_user_id: true, name: true },
    });
    if (!updated) throw new Error("Usuário customizado não encontrado");
    await this.upsertUserProfileForAuthUser(authUserId, undefined, role);
    return this.toPublicUser({ ...updated, role });
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

        const profile = await this.prisma.user_profiles.findUnique({
          where: { user_id: user.id },
          select: { role: true },
        });
        return {
          custom: this.toPublicUser({
            id: user.id,
            auth_user_id: user.auth_user_id,
            name: user.name,
            role: profile?.role ?? DbUserRole.USER,
          }),
          auth: authUser as UserWithAuthData["auth"],
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
    if (
      authUser.raw_user_meta_data &&
      typeof authUser.raw_user_meta_data === "object" &&
      authUser.raw_user_meta_data !== null
    ) {
      const metaData = authUser.raw_user_meta_data as Record<string, unknown>;
      if (metaData.name && typeof metaData.name === "string") {
        return metaData.name;
      }
    }

    if (authUser.email) {
      return authUser.email.split("@")[0];
    }

    if (authUser.identities && authUser.identities.length > 0) {
      const identity = authUser.identities[0];
      if (
        identity.identity_data &&
        typeof identity.identity_data === "object" &&
        identity.identity_data !== null
      ) {
        const identityData = identity.identity_data as Record<string, unknown>;
        if (identityData.name && typeof identityData.name === "string") {
          return identityData.name;
        }
        if (
          identityData.full_name &&
          typeof identityData.full_name === "string"
        ) {
          return identityData.full_name;
        }
      }
    }

    return "Usuário";
  }

  private async upsertUserProfileForAuthUser(
    authUserId: string,
    name?: string,
    role?: DbUserRole,
  ): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { auth_user_id: authUserId },
      select: { id: true, name: true },
    });
    if (!user) return;
    await this.upsertUserProfileForUser(
      user.id,
      name ?? user.name ?? "Usuário",
      role ?? DbUserRole.USER,
    );
  }

  private async upsertUserProfileForUser(
    userId: string,
    name?: string,
    role?: DbUserRole,
  ): Promise<void> {
    try {
      await this.prisma.user_profiles.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          name: name ?? "Usuário",
          role: role ?? DbUserRole.USER,
        },
        update: {
          name: name ?? "Usuário",
          role: role ?? DbUserRole.USER,
        },
      });
    } catch (error) {
      console.error("Erro ao sincronizar user_profiles:", error);
    }
  }

  private toPublicUser(row: {
    id: string;
    auth_user_id: string;
    name: string | null;
    role: DbUserRole;
  }): PublicUser {
    return {
      id: row.id,
      auth_user_id: row.auth_user_id,
      name: row.name,
      role: row.role,
    };
  }
}
