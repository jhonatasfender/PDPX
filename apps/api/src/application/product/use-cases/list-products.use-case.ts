import { Injectable, Inject } from "@nestjs/common";
import { ProductRepository } from "../interfaces/product.repository";
import { ProductImageRepository } from "../interfaces/product-image.repository";
import { ProductPriceRepository } from "../interfaces/product-price.repository";
import { Product } from "../../../domain/entities/product.entity";
import { ProductImage } from "../../../domain/entities/product-image.entity";
import { ProductPrice } from "../../../domain/entities/product-price.entity";

export interface ListProductsRequest {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  isActive?: boolean;
}

export interface ProductWithDetails {
  product: Product;
  images: ProductImage[];
  price: ProductPrice | null;
}

export interface ListProductsResponse {
  products: ProductWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListProductsUseCase {
  public constructor(
    @Inject("ProductRepository") private readonly productRepository: ProductRepository,
    @Inject("ProductImageRepository") private readonly productImageRepository: ProductImageRepository,
    @Inject("ProductPriceRepository") private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  public async execute(request: ListProductsRequest): Promise<ListProductsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;

    const { products, total } = await this.productRepository.findAll({
      page,
      limit,
      search: request.search,
      brand: request.brand,
      isActive: request.isActive,
    });

    const productsWithDetails: ProductWithDetails[] = await Promise.all(
      products.map(async (product) => {
        const [images, price] = await Promise.all([
          this.productImageRepository.findByProductId(product.id),
          this.productPriceRepository.findCurrentByProductId(product.id),
        ]);

        return {
          product,
          images,
          price,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      products: productsWithDetails,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
