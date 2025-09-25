import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { ProductPriceRepository } from "../../../application/product/interfaces/product-price.repository";
import { ProductPrice } from "../../../domain/entities/product-price.entity";

@Injectable()
export class PrismaProductPriceRepository implements ProductPriceRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByProductId(productId: string): Promise<ProductPrice[]> {
    const prices = await this.prisma.product_prices.findMany({
      where: { product_id: productId },
      orderBy: { created_at: "desc" },
    });

    return prices.map((price: Parameters<typeof ProductPrice.fromPrisma>[0]) =>
      ProductPrice.fromPrisma(price),
    );
  }

  public async findCurrentByProductId(
    productId: string,
  ): Promise<ProductPrice | null> {
    const now = new Date();

    const price = await this.prisma.product_prices.findFirst({
      where: {
        product_id: productId,
        valid_from: { lte: now },
        OR: [{ valid_to: null }, { valid_to: { gt: now } }],
      },
      orderBy: { created_at: "desc" },
    });

    if (!price) {
      return null;
    }

    return ProductPrice.fromPrisma(price);
  }

  public async create(data: {
    id: string;
    productId: string;
    currency: string;
    amountCents: number;
    validFrom?: Date;
    validTo?: Date | null;
  }): Promise<ProductPrice> {
    const price = await this.prisma.product_prices.create({
      data: {
        id: data.id,
        product_id: data.productId,
        currency: data.currency,
        amount_cents: data.amountCents,
        valid_from: data.validFrom ?? new Date(),
        valid_to: data.validTo,
      },
    });

    return ProductPrice.fromPrisma(price);
  }

  public async update(
    id: string,
    data: {
      currency?: string;
      amountCents?: number;
      validFrom?: Date;
      validTo?: Date | null;
    },
  ): Promise<ProductPrice> {
    const price = await this.prisma.product_prices.update({
      where: { id },
      data,
    });

    return ProductPrice.fromPrisma(price);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.product_prices.delete({
      where: { id },
    });
  }

  public async deleteByProductId(productId: string): Promise<void> {
    await this.prisma.product_prices.deleteMany({
      where: { product_id: productId },
    });
  }

  public async setCurrentPrice(
    productId: string,
    priceId: string,
  ): Promise<void> {
    const now = new Date();

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.product_prices.updateMany({
        where: { product_id: productId },
        data: { valid_to: now },
      });

      await tx.product_prices.update({
        where: { id: priceId },
        data: {
          valid_from: now,
          valid_to: null,
        },
      });
    });
  }
}
