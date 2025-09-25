import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProductRepository } from "../../../application/product/interfaces/product.repository";
import { Product } from "../../../domain/entities/product.entity";

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      return null;
    }

    return Product.fromPrisma(product);
  }

  public async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { slug },
    });

    if (!product) {
      return null;
    }

    return Product.fromPrisma(product);
  }

  public async findBySku(sku: string): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { sku },
    });

    if (!product) {
      return null;
    }

    return Product.fromPrisma(product);
  }

  public async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    isActive?: boolean;
  }): Promise<{ products: Product[]; total: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
        { sku: { contains: options.search, mode: "insensitive" } },
      ];
    }

    if (options?.brand) {
      where.brand = { contains: options.brand, mode: "insensitive" };
    }

    if (options?.isActive !== undefined) {
      where.is_active = options.isActive;
    }

    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.products.count({ where }),
    ]);

    return {
      products: products.map((product) => Product.fromPrisma(product)),
      total,
    };
  }

  public async create(data: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    sku: string;
    description: string;
    stock?: number;
    isActive?: boolean;
  }): Promise<Product> {
    const product = await this.prisma.products.create({
      data: {
        id: data.id,
        slug: data.slug,
        name: data.name,
        brand: data.brand,
        sku: data.sku,
        description: data.description,
        stock: data.stock ?? 0,
        is_active: data.isActive ?? true,
      },
    });

    return Product.fromPrisma(product);
  }

  public async update(
    id: string,
    data: {
      slug?: string;
      name?: string;
      brand?: string;
      sku?: string;
      description?: string;
      stock?: number;
      isActive?: boolean;
    },
  ): Promise<Product> {
    const { isActive, ...restData } = data;
    
    const product = await this.prisma.products.update({
      where: { id },
      data: {
        ...restData,
        is_active: isActive,
        updated_at: new Date(),
      },
    });

    return Product.fromPrisma(product);
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.products.delete({
      where: { id },
    });
  }
}
