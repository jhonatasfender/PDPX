import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BagRepository } from "../../../application/bag/interfaces/bag.repository";
import { Bag } from "../../../domain/entities/bag.entity";
import { BagStatus } from "@prisma/client";

@Injectable()
export class PrismaBagRepository implements BagRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findById(id: string): Promise<Bag | null> {
    const bag = await this.prisma.bags.findUnique({
      where: { id },
    });

    if (!bag) return null;

    return Bag.fromPrisma(bag);
  }

  public async findByUserId(userId: string): Promise<Bag[]> {
    const bags = await this.prisma.bags.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    return bags.map((bag) => Bag.fromPrisma(bag));
  }

  public async findActiveByUserId(userId: string): Promise<Bag | null> {
    const bag = await this.prisma.bags.findFirst({
      where: {
        user_id: userId,
        status: BagStatus.ACTIVE,
      },
      orderBy: { created_at: "desc" },
    });

    if (!bag) return null;

    return Bag.fromPrisma(bag);
  }

  public async create(data: {
    id: string;
    userId: string;
    status?: BagStatus;
    expiresAt?: Date | null;
  }): Promise<Bag> {
    const bag = await this.prisma.bags.create({
      data: {
        id: data.id,
        user_id: data.userId,
        status: data.status || BagStatus.ACTIVE,
        expires_at: data.expiresAt,
      },
    });

    return Bag.fromPrisma(bag);
  }

  public async updateStatus(id: string, status: BagStatus): Promise<Bag> {
    const bag = await this.prisma.bags.update({
      where: { id },
      data: { status },
    });

    return Bag.fromPrisma(bag);
  }

  public async updateExpiresAt(
    id: string,
    expiresAt: Date | null,
  ): Promise<Bag> {
    const bag = await this.prisma.bags.update({
      where: { id },
      data: { expires_at: expiresAt },
    });

    return Bag.fromPrisma(bag);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.bags.delete({
      where: { id },
    });
  }

  public async findExpiredBags(): Promise<Bag[]> {
    const bags = await this.prisma.bags.findMany({
      where: {
        expires_at: {
          lt: new Date(),
        },
        status: BagStatus.ACTIVE,
      },
    });

    return bags.map((bag) => Bag.fromPrisma(bag));
  }
}
