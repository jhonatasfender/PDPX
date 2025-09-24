import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";

@Injectable()
export class AuthUserRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<any | null> {
    const identity = await this.prisma.auth_identities.findFirst({
      where: { provider, provider_id: providerId },
      include: { users: true },
    });
    return identity?.users || null;
  }

  public async findByEmail(email: string): Promise<any | null> {
    return this.prisma.auth_users.findFirst({
      where: { email },
      include: { identities: true },
    });
  }

  public async updateLastSignIn(authUserId: string): Promise<void> {
    await this.prisma.auth_users.update({
      where: { id: authUserId },
      data: { last_sign_in_at: new Date() },
    });
  }
}
