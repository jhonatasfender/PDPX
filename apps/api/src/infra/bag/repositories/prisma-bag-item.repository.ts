import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BagItemRepository } from "../../../application/bag/interfaces/bag-item.repository";
import { BagItem } from "../../../domain/entities/bag-item.entity";

@Injectable()
export class PrismaBagItemRepository implements BagItemRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findById(id: string): Promise<BagItem | null> {
    const bagItem = await this.prisma.bag_items.findUnique({
      where: { id },
    });

    if (!bagItem) return null;

    return BagItem.fromPrisma(bagItem);
  }

  public async findByBagId(bagId: string): Promise<BagItem[]> {
    const bagItems = await this.prisma.bag_items.findMany({
      where: { bag_id: bagId },
      orderBy: { created_at: "asc" },
    });

    return bagItems.map((item) => BagItem.fromPrisma(item));
  }

  public async findByBagIdAndProductId(
    bagId: string,
    productId: string,
  ): Promise<BagItem | null> {
    const bagItem = await this.prisma.bag_items.findUnique({
      where: {
        bag_id_product_id: {
          bag_id: bagId,
          product_id: productId,
        },
      },
    });

    if (!bagItem) return null;

    return BagItem.fromPrisma(bagItem);
  }

  public async create(data: {
    id: string;
    bagId: string;
    productId: string;
    quantity: number;
    priceCents: number;
  }): Promise<BagItem> {
    const bagItem = await this.prisma.bag_items.create({
      data: {
        id: data.id,
        bag_id: data.bagId,
        product_id: data.productId,
        quantity: data.quantity,
        price_cents: data.priceCents,
      },
    });

    return BagItem.fromPrisma(bagItem);
  }

  public async updateQuantity(id: string, quantity: number): Promise<BagItem> {
    const bagItem = await this.prisma.bag_items.update({
      where: { id },
      data: { quantity },
    });

    return BagItem.fromPrisma(bagItem);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.bag_items.delete({
      where: { id },
    });
  }

  public async deleteByBagId(bagId: string): Promise<void> {
    await this.prisma.bag_items.deleteMany({
      where: { bag_id: bagId },
    });
  }
}
