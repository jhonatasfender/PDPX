import { Product } from "../../domain/entities/product.entity";
import { ProductImage } from "../../domain/entities/product-image.entity";
import { ProductPrice } from "../../domain/entities/product-price.entity";
import {
  ProductResponseDto,
  ProductImageResponseDto,
  ProductPriceResponseDto,
} from "../dto/product/product-response.dto";

export class ProductCoreMapper {
  public static productToDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      sku: product.sku,
      description: product.description,
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  public static imageToDto(image: ProductImage): ProductImageResponseDto {
    return {
      id: image.id,
      productId: image.productId,
      url: image.url,
      alt: image.alt,
      isPrimary: image.isPrimary,
      position: image.position,
      createdAt: image.createdAt,
    };
  }

  public static priceToDto(price: ProductPrice): ProductPriceResponseDto {
    return {
      id: price.id,
      productId: price.productId,
      currency: price.currency,
      amountCents: price.amountCents,
      amount: price.getAmountInCurrency(),
      validFrom: price.validFrom,
      validTo: price.validTo,
      createdAt: price.createdAt,
    };
  }
}
