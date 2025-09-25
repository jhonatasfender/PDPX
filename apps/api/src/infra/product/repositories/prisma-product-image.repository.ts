import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { ProductImageRepository } from "../../../application/product/interfaces/product-image.repository";
import { ProductImage } from "../../../domain/entities/product-image.entity";

@Injectable()
export class PrismaProductImageRepository implements ProductImageRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findByProductId(productId: string): Promise<ProductImage[]> {
    const images = await this.prisma.product_images.findMany({
      where: { product_id: productId },
      orderBy: { position: "asc" },
    });

    return images.map((image: Parameters<typeof ProductImage.fromPrisma>[0]) =>
      ProductImage.fromPrisma(image),
    );
  }

  public async findPrimaryByProductId(
    productId: string,
  ): Promise<ProductImage | null> {
    const image = await this.prisma.product_images.findFirst({
      where: {
        product_id: productId,
        is_primary: true,
      },
    });

    if (!image) {
      return null;
    }

    return ProductImage.fromPrisma(image);
  }

  public async create(data: {
    id: string;
    productId: string;
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }): Promise<ProductImage> {
    let altValue: string | null = null;
    if (data.alt !== undefined && data.alt !== null) {
      if (typeof data.alt === "string" && data.alt.trim() !== "") {
        altValue = data.alt;
      }
    }

    const image = await this.prisma.product_images.create({
      data: {
        id: data.id,
        product_id: data.productId,
        url: data.url,
        alt: altValue,
        is_primary: data.isPrimary ?? false,
        position: data.position ?? 0,
      },
    });

    return ProductImage.fromPrisma(image);
  }

  public async update(
    id: string,
    data: {
      url?: string;
      alt?: string | null;
      isPrimary?: boolean;
      position?: number;
    },
  ): Promise<ProductImage> {
    const updateData: any = { ...data };

    if (data.alt !== undefined) {
      let altValue: string | null = null;
      if (data.alt !== null) {
        if (typeof data.alt === "string" && data.alt.trim() !== "") {
          altValue = data.alt;
        }
      }
      updateData.alt = altValue;
    }

    const image = await this.prisma.product_images.update({
      where: { id },
      data: updateData,
    });

    return ProductImage.fromPrisma(image);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.product_images.delete({
      where: { id },
    });
  }

  public async deleteByProductId(productId: string): Promise<void> {
    await this.prisma.product_images.deleteMany({
      where: { product_id: productId },
    });
  }

  public async setPrimary(productId: string, imageId: string): Promise<void> {
    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.product_images.updateMany({
        where: { product_id: productId },
        data: { is_primary: false },
      });

      await tx.product_images.update({
        where: { id: imageId },
        data: { is_primary: true },
      });
    });
  }
}
