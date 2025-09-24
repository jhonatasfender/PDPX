import { Injectable, Inject } from "@nestjs/common";
import { ProductRepository } from "../interfaces/product.repository";
import { ProductImageRepository } from "../interfaces/product-image.repository";
import { ProductPriceRepository } from "../interfaces/product-price.repository";
import { Product } from "../../../domain/entities/product.entity";
import { ProductImage } from "../../../domain/entities/product-image.entity";
import { ProductPrice } from "../../../domain/entities/product-price.entity";
import { ProductSlugAlreadyExistsException, ProductSkuAlreadyExistsException } from "../../../domain/exceptions/product-exceptions";

export interface CreateProductRequest {
  slug: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  stock: number;
  price: {
    currency: string;
    amountCents: number;
  };
  images: Array<{
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }>;
  isActive?: boolean;
}

export interface CreateProductResponse {
  product: Product;
  images: ProductImage[];
  price: ProductPrice;
}

@Injectable()
export class CreateProductUseCase {
  public constructor(
    @Inject("ProductRepository") private readonly productRepository: ProductRepository,
    @Inject("ProductImageRepository") private readonly productImageRepository: ProductImageRepository,
    @Inject("ProductPriceRepository") private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  public async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    const existingBySlug = await this.productRepository.findBySlug(request.slug);
    if (existingBySlug) {
      throw new ProductSlugAlreadyExistsException(request.slug);
    }

    const existingBySku = await this.productRepository.findBySku(request.sku);
    if (existingBySku) {
      throw new ProductSkuAlreadyExistsException(request.sku);
    }

    const productId = crypto.randomUUID();
    const priceId = crypto.randomUUID();

    const product = await this.productRepository.create({
      id: productId,
      slug: request.slug,
      name: request.name,
      brand: request.brand,
      sku: request.sku,
      description: request.description,
      stock: request.stock,
      isActive: request.isActive ?? true,
    });

    const price = await this.productPriceRepository.create({
      id: priceId,
      productId: productId,
      currency: request.price.currency,
      amountCents: request.price.amountCents,
    });

    const images: ProductImage[] = [];
    for (let i = 0; i < request.images.length; i++) {
      const imageData = request.images[i];
      const imageId = crypto.randomUUID();
      
      const image = await this.productImageRepository.create({
        id: imageId,
        productId: productId,
        url: imageData.url,
        alt: imageData.alt,
        isPrimary: imageData.isPrimary ?? (i === 0),
        position: imageData.position ?? i,
      });

      images.push(image);
    }

    return {
      product,
      images,
      price,
    };
  }
}
