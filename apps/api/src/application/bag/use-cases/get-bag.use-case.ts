import { Injectable, Inject } from "@nestjs/common";
import { BagRepository } from "../interfaces/bag.repository";
import { BagItemRepository } from "../interfaces/bag-item.repository";
import { Bag } from "../../../domain/entities/bag.entity";
import { BagItem } from "../../../domain/entities/bag-item.entity";

export interface GetBagRequest {
  userId: string;
}

export interface GetBagResponse {
  bag: Bag | null;
  bagItems: BagItem[];
  totalItems: number;
  totalPriceCents: number;
}

@Injectable()
export class GetBagUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
  ) {}

  public async execute(request: GetBagRequest): Promise<GetBagResponse> {
    const bag = await this.bagRepository.findActiveByUserId(request.userId);

    if (!bag) {
      return {
        bag: null,
        bagItems: [],
        totalItems: 0,
        totalPriceCents: 0,
      };
    }

    const bagItems = await this.bagItemRepository.findByBagId(bag.id);
    const totalItems = bagItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPriceCents = bagItems.reduce(
      (sum, item) => sum + item.getTotalPriceCents(),
      0,
    );

    return {
      bag,
      bagItems,
      totalItems,
      totalPriceCents,
    };
  }
}
