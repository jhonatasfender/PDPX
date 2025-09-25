import { Injectable, Inject } from "@nestjs/common";
import { BagRepository } from "../interfaces/bag.repository";
import { BagItemRepository } from "../interfaces/bag-item.repository";
import { BagItem } from "../../../domain/entities/bag-item.entity";

export interface UpdateItemQuantityRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface UpdateItemQuantityResponse {
  bagItem: BagItem | null;
  success: boolean;
  message: string;
}

@Injectable()
export class UpdateItemQuantityUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
  ) {}

  public async execute(
    request: UpdateItemQuantityRequest,
  ): Promise<UpdateItemQuantityResponse> {
    if (request.quantity <= 0) {
      return {
        bagItem: null,
        success: false,
        message: "Quantidade deve ser maior que zero",
      };
    }

    const bag = await this.bagRepository.findActiveByUserId(request.userId);

    if (!bag) {
      return {
        bagItem: null,
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
        bagItem: null,
        success: false,
        message: "Item não encontrado no carrinho",
      };
    }

    const updatedItem = await this.bagItemRepository.updateQuantity(
      bagItem.id,
      request.quantity,
    );

    return {
      bagItem: updatedItem,
      success: true,
      message: "Quantidade atualizada com sucesso",
    };
  }
}
