import { ProductPrice } from "../../../domain/entities/product-price.entity";

export interface ProductPriceRepository {
  findByProductId(productId: string): Promise<ProductPrice[]>;
  findCurrentByProductId(productId: string): Promise<ProductPrice | null>;
  create(data: {
    id: string;
    productId: string;
    currency: string;
    amountCents: number;
    validFrom?: Date;
    validTo?: Date | null;
  }): Promise<ProductPrice>;
  update(
    id: string,
    data: {
      currency?: string;
      amountCents?: number;
      validFrom?: Date;
      validTo?: Date | null;
    },
  ): Promise<ProductPrice>;
  delete(id: string): Promise<void>;
  deleteByProductId(productId: string): Promise<void>;
  setCurrentPrice(productId: string, priceId: string): Promise<void>;
}
