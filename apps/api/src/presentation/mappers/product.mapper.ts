import { Product } from "../../domain/entities/product.entity";
import { ProductImage } from "../../domain/entities/product-image.entity";
import { ProductPrice } from "../../domain/entities/product-price.entity";
import {
  ProductResponseDto,
  ProductImageResponseDto,
  ProductPriceResponseDto,
  ProductWithDetailsResponseDto,
  ListProductsResponseDto,
  CreateProductResponseDto,
  UpdateProductResponseDto,
  DeleteProductResponseDto,
} from "../dto/product/product-response.dto";
import { CreateProductDto } from "../dto/product/create-product.dto";
import { UpdateProductDto } from "../dto/product/update-product.dto";
import {
  CreateProductRequest,
  CreateProductResponse,
} from "../../application/product/use-cases/create-product.use-case";
import { GetProductResponse } from "../../application/product/use-cases/get-product.use-case";
import { ListProductsResponse } from "../../application/product/use-cases/list-products.use-case";
import {
  UpdateProductRequest,
  UpdateProductResponse,
} from "../../application/product/use-cases/update-product.use-case";
import { DeleteProductResponse } from "../../application/product/use-cases/delete-product.use-case";

export class ProductMapper {
  public static fromDomain(product: Product): ProductResponseDto {
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

  public static imageFromDomain(image: ProductImage): ProductImageResponseDto {
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

  public static priceFromDomain(price: ProductPrice): ProductPriceResponseDto {
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

  public static toCreateProductRequest(
    dto: CreateProductDto,
  ): CreateProductRequest {
    return {
      slug: dto.slug,
      name: dto.name,
      brand: dto.brand,
      sku: dto.sku,
      description: dto.description,
      stock: dto.stock,
      price: {
        currency: dto.price.currency,
        amountCents: dto.price.amountCents,
      },
      images: dto.images.map((img) => ({
        url: img.url,
        alt: img.alt || null,
        isPrimary: img.isPrimary,
        position: img.position,
      })),
      isActive: dto.isActive,
    };
  }

  public static toUpdateProductRequest(
    id: string,
    dto: UpdateProductDto,
  ): UpdateProductRequest {
    return {
      id,
      slug: dto.slug,
      name: dto.name,
      brand: dto.brand,
      sku: dto.sku,
      description: dto.description,
      stock: dto.stock,
      price: dto.price
        ? {
            currency: dto.price.currency,
            amountCents: dto.price.amountCents,
          }
        : undefined,
      images: dto.images?.map((img) => ({
        url: img.url,
        alt: img.alt || null,
        isPrimary: img.isPrimary,
        position: img.position,
      })),
      isActive: dto.isActive,
    };
  }

  public static toCreateProductResponse(
    response: CreateProductResponse,
  ): CreateProductResponseDto {
    return {
      product: this.fromDomain(response.product),
      images: response.images.map((img: any) => this.imageFromDomain(img)),
      price: this.priceFromDomain(response.price),
    };
  }

  public static toGetProductResponse(
    response: GetProductResponse,
  ): ProductWithDetailsResponseDto {
    return {
      product: this.fromDomain(response.product),
      images: response.images.map((img: any) => this.imageFromDomain(img)),
      price: response.price ? this.priceFromDomain(response.price) : null,
    };
  }

  public static toUpdateProductResponse(
    response: UpdateProductResponse,
  ): UpdateProductResponseDto {
    return {
      product: this.fromDomain(response.product),
      images: response.images.map((img: any) => this.imageFromDomain(img)),
      price: response.price ? this.priceFromDomain(response.price) : null,
    };
  }

  public static toListProductsResponse(
    response: ListProductsResponse,
  ): ListProductsResponseDto {
    return {
      products: response.products.map((item: any) => ({
        product: this.fromDomain(item.product),
        images: item.images.map((img: any) => this.imageFromDomain(img)),
        price: item.price ? this.priceFromDomain(item.price) : null,
      })),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    };
  }

  public static toDeleteProductResponse(
    response: DeleteProductResponse,
  ): DeleteProductResponseDto {
    return {
      success: response.success,
      message: response.message,
    };
  }
}
