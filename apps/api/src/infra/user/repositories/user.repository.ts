import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { UserRole } from "@prisma/client";

@Injectable()
export class UserRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  public async create(data: {
    id: string;
    auth_user_id: string;
    role?: UserRole;
  }) {
    return this.prisma.users.create({
      data: {
        id: data.id,
        auth_user_id: data.auth_user_id,
      },
    });
  }

  public async updateRole() {
    return Promise.resolve();
  }

  public async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        auth_user_id: true,
      },
    });
  }
}
