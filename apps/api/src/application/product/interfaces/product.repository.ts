import { Product } from "../../../domain/entities/product.entity";

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    isActive?: boolean;
  }): Promise<{ products: Product[]; total: number }>;
  create(data: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    sku: string;
    description: string;
    stock?: number;
    isActive?: boolean;
  }): Promise<Product>;
  update(
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
  ): Promise<Product>;
  delete(id: string): Promise<void>;
}
