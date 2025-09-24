import { Injectable, Inject } from "@nestjs/common";
import { ProductRepository } from "../interfaces/product.repository";
import { ProductImageRepository } from "../interfaces/product-image.repository";
import { ProductPriceRepository } from "../interfaces/product-price.repository";
import { Product } from "../../../domain/entities/product.entity";
import { ProductImage } from "../../../domain/entities/product-image.entity";
import { ProductPrice } from "../../../domain/entities/product-price.entity";
import { ProductSlugAlreadyExistsException, ProductSkuAlreadyExistsException, ProductNotFoundException } from "../../../domain/exceptions/product-exceptions";

export interface UpdateProductRequest {
  id: string;
  slug?: string;
  name?: string;
  brand?: string;
  sku?: string;
  description?: string;
  stock?: number;
  price?: {
    currency: string;
    amountCents: number;
  };
  images?: Array<{
    id?: string;
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }>;
  isActive?: boolean;
}

export interface UpdateProductResponse {
  product: Product;
  images: ProductImage[];
  price: ProductPrice | null;
}

@Injectable()
export class UpdateProductUseCase {
  public constructor(
    @Inject("ProductRepository") private readonly productRepository: ProductRepository,
    @Inject("ProductImageRepository") private readonly productImageRepository: ProductImageRepository,
    @Inject("ProductPriceRepository") private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  public async execute(request: UpdateProductRequest): Promise<UpdateProductResponse> {
    const existingProduct = await this.productRepository.findById(request.id);
    if (!existingProduct) {
      throw new ProductNotFoundException(request.id);
    }

    if (request.slug && request.slug !== existingProduct.slug) {
      const existingBySlug = await this.productRepository.findBySlug(request.slug);
      if (existingBySlug) {
        throw new ProductSlugAlreadyExistsException(request.slug);
      }
    }

    if (request.sku && request.sku !== existingProduct.sku) {
      const existingBySku = await this.productRepository.findBySku(request.sku);
      if (existingBySku) {
        throw new ProductSkuAlreadyExistsException(request.sku);
      }
    }

    const product = await this.productRepository.update(request.id, {
      slug: request.slug,
      name: request.name,
      brand: request.brand,
      sku: request.sku,
      description: request.description,
      stock: request.stock,
      isActive: request.isActive,
    });

    let price: ProductPrice | null = null;
    let images: ProductImage[] = [];

    if (request.price) {
      const currentPrice = await this.productPriceRepository.findCurrentByProductId(request.id);
      
      if (currentPrice && 
          currentPrice.currency === request.price.currency && 
          currentPrice.amountCents === request.price.amountCents) {
        price = currentPrice;
      } else {
        const priceId = crypto.randomUUID();
        price = await this.productPriceRepository.create({
          id: priceId,
          productId: request.id,
          currency: request.price.currency,
          amountCents: request.price.amountCents,
        });
      }
    } else {
      price = await this.productPriceRepository.findCurrentByProductId(request.id);
    }

    if (request.images) {
      await this.productImageRepository.deleteByProductId(request.id);

      for (let i = 0; i < request.images.length; i++) {
        const imageData = request.images[i];
        const imageId = imageData.id || crypto.randomUUID();
        
        const image = await this.productImageRepository.create({
          id: imageId,
          productId: request.id,
          url: imageData.url,
          alt: imageData.alt,
          isPrimary: imageData.isPrimary ?? (i === 0),
          position: imageData.position ?? i,
        });

        images.push(image);
      }
    } else {
      images = await this.productImageRepository.findByProductId(request.id);
    }

    return {
      product,
      images,
      price,
    };
  }
}
