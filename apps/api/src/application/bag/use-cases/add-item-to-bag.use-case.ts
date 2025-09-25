import { Injectable, Inject } from "@nestjs/common";
import { BagRepository } from "../interfaces/bag.repository";
import { BagItemRepository } from "../interfaces/bag-item.repository";
import { ProductPriceRepository } from "../../product/interfaces/product-price.repository";
import { Bag } from "../../../domain/entities/bag.entity";
import { BagItem } from "../../../domain/entities/bag-item.entity";
import { BagStatus } from "@prisma/client";

export interface AddItemToBagRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface AddItemToBagResponse {
  bag: Bag;
  bagItem: BagItem;
}

@Injectable()
export class AddItemToBagUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
    @Inject("ProductPriceRepository")
    private readonly productPriceRepository: ProductPriceRepository,
  ) {}

  public async execute(
    request: AddItemToBagRequest,
  ): Promise<AddItemToBagResponse> {
    let bag = await this.bagRepository.findActiveByUserId(request.userId);

    if (!bag) {
      const bagId = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      bag = await this.bagRepository.create({
        id: bagId,
        userId: request.userId,
        status: BagStatus.ACTIVE,
        expiresAt,
      });
    }

    const currentPrice = await this.productPriceRepository.findCurrentByProductId(
      request.productId,
    );

    if (!currentPrice) {
      throw new Error("Produto não encontrado ou sem preço");
    }

    const existingItem = await this.bagItemRepository.findByBagIdAndProductId(
      bag.id,
      request.productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + request.quantity;
      const updatedItem = await this.bagItemRepository.updateQuantity(
        existingItem.id,
        newQuantity,
      );

      return {
        bag,
        bagItem: updatedItem,
      };
    }

    const bagItemId = crypto.randomUUID();
    const bagItem = await this.bagItemRepository.create({
      id: bagItemId,
      bagId: bag.id,
      productId: request.productId,
      quantity: request.quantity,
      priceCents: currentPrice.amountCents,
    });

    return {
      bag,
      bagItem,
    };
  }
}
