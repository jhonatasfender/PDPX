import { Injectable, Inject } from "@nestjs/common";
import { ProductRepository } from "../interfaces/product.repository";
import { ProductImageRepository } from "../interfaces/product-image.repository";
import { ProductPriceRepository } from "../interfaces/product-price.repository";
import { ProductNotFoundException } from "../../../domain/exceptions/product-exceptions";

export interface DeleteProductRequest {
  id: string;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class DeleteProductUseCase {
  public constructor(
    @Inject("ProductRepository") private readonly productRepository: ProductRepository,
    @Inject("ProductImageRepository") private readonly productImageRepository: ProductImageRepository,
    @Inject("ProductPriceRepository") private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  public async execute(request: DeleteProductRequest): Promise<DeleteProductResponse> {
    const existingProduct = await this.productRepository.findById(request.id);
    if (!existingProduct) {
      throw new ProductNotFoundException(request.id);
    }

    await this.productImageRepository.deleteByProductId(request.id);
    await this.productPriceRepository.deleteByProductId(request.id);

    await this.productRepository.delete(request.id);

    return {
      success: true,
      message: "Produto deletado com sucesso",
    };
  }
}
