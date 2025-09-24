import { ProductImage } from "../../../domain/entities/product-image.entity";

export interface ProductImageRepository {
  findByProductId(productId: string): Promise<ProductImage[]>;
  findPrimaryByProductId(productId: string): Promise<ProductImage | null>;
  create(data: {
    id: string;
    productId: string;
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }): Promise<ProductImage>;
  update(id: string, data: {
    url?: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }): Promise<ProductImage>;
  delete(id: string): Promise<void>;
  deleteByProductId(productId: string): Promise<void>;
  setPrimary(productId: string, imageId: string): Promise<void>;
}

