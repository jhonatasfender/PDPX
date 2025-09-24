import { Injectable, Inject } from "@nestjs/common";
import { ProductRepository } from "../interfaces/product.repository";
import { ProductImageRepository } from "../interfaces/product-image.repository";
import { ProductPriceRepository } from "../interfaces/product-price.repository";
import { Product } from "../../../domain/entities/product.entity";
import { ProductImage } from "../../../domain/entities/product-image.entity";
import { ProductPrice } from "../../../domain/entities/product-price.entity";
import { ProductNotFoundException } from "../../../domain/exceptions/product-exceptions";
import { InvalidParametersException } from "../../../domain/exceptions/generic-exceptions";

export interface GetProductRequest {
  id?: string;
  slug?: string;
}

export interface GetProductResponse {
  product: Product;
  images: ProductImage[];
  price: ProductPrice | null;
}

@Injectable()
export class GetProductUseCase {
  public constructor(
    @Inject("ProductRepository")
    private readonly productRepository: ProductRepository,
    @Inject("ProductImageRepository")
    private readonly productImageRepository: ProductImageRepository,
    @Inject("ProductPriceRepository")
    private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  public async execute(
    request: GetProductRequest,
  ): Promise<GetProductResponse> {
    let product: Product | null = null;

    if (request.id) {
      product = await this.productRepository.findById(request.id);
    } else if (request.slug) {
      product = await this.productRepository.findBySlug(request.slug);
    } else {
      throw new InvalidParametersException("ID ou slug deve ser fornecido");
    }

    if (!product) {
      const identifier = request.id || request.slug || "desconhecido";
      throw new ProductNotFoundException(identifier);
    }

    const images = await this.productImageRepository.findByProductId(
      product.id,
    );

    const price = await this.productPriceRepository.findCurrentByProductId(
      product.id,
    );

    return {
      product,
      images,
      price,
    };
  }
}
