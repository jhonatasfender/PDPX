import { Injectable, Inject } from "@nestjs/common";
import { BagRepository } from "../interfaces/bag.repository";
import { BagItemRepository } from "../interfaces/bag-item.repository";
import { BagStatus } from "@prisma/client";

export interface ClearBagRequest {
  userId: string;
}

export interface ClearBagResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class ClearBagUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
  ) {}

  public async execute(request: ClearBagRequest): Promise<ClearBagResponse> {
    const bag = await this.bagRepository.findActiveByUserId(request.userId);

    if (!bag) {
      return {
        success: false,
        message: "Carrinho não encontrado",
      };
    }

    await this.bagItemRepository.deleteByBagId(bag.id);
    await this.bagRepository.updateStatus(bag.id, BagStatus.ABANDONED);

    return {
      success: true,
      message: "Carrinho limpo com sucesso",
    };
  }
}
