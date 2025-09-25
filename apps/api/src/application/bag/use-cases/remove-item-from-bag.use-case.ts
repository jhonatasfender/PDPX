import { Injectable, Inject } from "@nestjs/common";
import { BagRepository } from "../interfaces/bag.repository";
import { BagItemRepository } from "../interfaces/bag-item.repository";
import { Bag } from "../../../domain/entities/bag.entity";

export interface RemoveItemFromBagRequest {
  userId: string;
  productId: string;
}

export interface RemoveItemFromBagResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class RemoveItemFromBagUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
  ) {}

  public async execute(
    request: RemoveItemFromBagRequest,
  ): Promise<RemoveItemFromBagResponse> {
    const bag = await this.bagRepository.findActiveByUserId(request.userId);

    if (!bag) {
      return {
        success: false,
        message: "Carrinho não encontrado",
      };
    }

    const bagItem = await this.bagItemRepository.findByBagIdAndProductId(
      bag.id,
      request.productId,
    );

    if (!bagItem) {
      return {
        success: false,
        message: "Item não encontrado no carrinho",
      };
    }

    await this.bagItemRepository.delete(bagItem.id);

    return {
      success: true,
      message: "Item removido do carrinho com sucesso",
    };
  }
}
