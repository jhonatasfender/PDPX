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

import { ProductCoreMapper } from "./product-core.mapper";

export class ProductMapper {
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
      product: ProductCoreMapper.productToDto(response.product),
      images: response.images.map((img: ProductImage) =>
        ProductCoreMapper.imageToDto(img),
      ),
      price: ProductCoreMapper.priceToDto(response.price),
    };
  }

  public static toGetProductResponse(
    response: GetProductResponse,
  ): ProductWithDetailsResponseDto {
    return {
      product: ProductCoreMapper.productToDto(response.product),
      images: response.images.map((img: ProductImage) =>
        ProductCoreMapper.imageToDto(img),
      ),
      price: response.price
        ? ProductCoreMapper.priceToDto(response.price)
        : null,
    };
  }

  public static toUpdateProductResponse(
    response: UpdateProductResponse,
  ): UpdateProductResponseDto {
    return {
      product: ProductCoreMapper.productToDto(response.product),
      images: response.images.map((img: ProductImage) =>
        ProductCoreMapper.imageToDto(img),
      ),
      price: response.price
        ? ProductCoreMapper.priceToDto(response.price)
        : null,
    };
  }

  public static toListProductsResponse(
    response: ListProductsResponse,
  ): ListProductsResponseDto {
    return {
      products: response.products.map((item: any) => ({
        product: ProductCoreMapper.productToDto(item.product),
        images: item.images.map((img: ProductImage) =>
          ProductCoreMapper.imageToDto(img),
        ),
        price: item.price ? ProductCoreMapper.priceToDto(item.price) : null,
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
