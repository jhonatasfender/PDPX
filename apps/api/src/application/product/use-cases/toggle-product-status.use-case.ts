import { Injectable, Inject } from "@nestjs/common";
import { ProductRepository } from "../interfaces/product.repository";
import { ProductNotFoundException } from "../../../domain/exceptions/product-exceptions";
import { Product } from "../../../domain/entities/product.entity";

export interface ToggleProductStatusRequest {
  id: string;
}

export interface ToggleProductStatusResponse {
  product: Product;
  message: string;
}

@Injectable()
export class ToggleProductStatusUseCase {
  public constructor(
    @Inject("ProductRepository")
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(
    request: ToggleProductStatusRequest,
  ): Promise<ToggleProductStatusResponse> {
    const existingProduct = await this.productRepository.findById(request.id);
    if (!existingProduct) {
      throw new ProductNotFoundException(request.id);
    }

    const newStatus = !existingProduct.isActive;
    const product = await this.productRepository.update(request.id, {
      isActive: newStatus,
    });

    const message = newStatus
      ? "Produto ativado com sucesso"
      : "Produto desativado com sucesso";

    return {
      product,
      message,
    };
  }
}
