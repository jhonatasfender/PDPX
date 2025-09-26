import { Injectable, Inject } from "@nestjs/common";
import { BagRepository } from "../interfaces/bag.repository";
import { BagItemRepository } from "../interfaces/bag-item.repository";
import { BagStatus } from "@prisma/client";

export interface ConvertBagRequest {
  userId: string;
}

export interface ConvertBagResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class ConvertBagUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
  ) {}

  public async execute(
    request: ConvertBagRequest,
  ): Promise<ConvertBagResponse> {
    const bag = await this.bagRepository.findActiveByUserId(request.userId);
    if (!bag) {
      return { success: false, message: "Nenhuma bag ativa encontrada" };
    }

    const items = await this.bagItemRepository.findByBagId(bag.id);
    if (items.length === 0) {
      return { success: false, message: "Carrinho vazio" };
    }

    await this.bagRepository.updateStatus(bag.id, BagStatus.CONVERTED);

    await this.bagRepository.create({
      id: crypto.randomUUID(),
      userId: request.userId,
    });

    return { success: true, message: "Compra finalizada" };
  }
}
