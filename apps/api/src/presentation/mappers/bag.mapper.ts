import { Bag } from "../../domain/entities/bag.entity";
import { BagItem } from "../../domain/entities/bag-item.entity";
import {
  BagResponseDto,
  BagItemResponseDto,
  GetBagResponseDto,
  AddItemToBagResponseDto,
  UpdateItemQuantityResponseDto,
  RemoveItemFromBagResponseDto,
  ClearBagResponseDto,
} from "../dto/bag/bag-response.dto";
import { AddItemToBagDto } from "../dto/bag/add-item-to-bag.dto";
import { UpdateItemQuantityDto } from "../dto/bag/update-item-quantity.dto";
import { RemoveItemFromBagDto } from "../dto/bag/remove-item-from-bag.dto";
import {
  AddItemToBagRequest,
  AddItemToBagResponse,
} from "../../application/bag/use-cases/add-item-to-bag.use-case";
import { GetBagResponse } from "../../application/bag/use-cases/get-bag.use-case";
import {
  UpdateItemQuantityRequest,
  UpdateItemQuantityResponse,
} from "../../application/bag/use-cases/update-item-quantity.use-case";
import {
  RemoveItemFromBagRequest,
  RemoveItemFromBagResponse,
} from "../../application/bag/use-cases/remove-item-from-bag.use-case";
import { ClearBagResponse } from "../../application/bag/use-cases/clear-bag.use-case";

export class BagMapper {
  public static bagToDto(bag: Bag): BagResponseDto {
    return {
      id: bag.id,
      userId: bag.userId,
      status: bag.status,
      createdAt: bag.createdAt,
      updatedAt: bag.updatedAt,
      expiresAt: bag.expiresAt,
    };
  }

  public static bagItemToDto(bagItem: BagItem): BagItemResponseDto {
    return {
      id: bagItem.id,
      bagId: bagItem.bagId,
      productId: bagItem.productId,
      quantity: bagItem.quantity,
      priceCents: bagItem.priceCents,
      price: bagItem.getPrice(),
      totalPriceCents: bagItem.getTotalPriceCents(),
      totalPrice: bagItem.getTotalPrice(),
      createdAt: bagItem.createdAt,
      updatedAt: bagItem.updatedAt,
    };
  }

  public static toAddItemRequest(
    userId: string,
    dto: AddItemToBagDto,
  ): AddItemToBagRequest {
    return {
      userId,
      productId: dto.productId,
      quantity: dto.quantity,
    };
  }

  public static toUpdateItemQuantityRequest(
    userId: string,
    dto: UpdateItemQuantityDto,
  ): UpdateItemQuantityRequest {
    return {
      userId,
      productId: dto.productId,
      quantity: dto.quantity,
    };
  }

  public static toRemoveItemRequest(
    userId: string,
    dto: RemoveItemFromBagDto,
  ): RemoveItemFromBagRequest {
    return {
      userId,
      productId: dto.productId,
    };
  }

  public static toGetBagResponse(response: GetBagResponse): GetBagResponseDto {
    return {
      bag: response.bag ? this.bagToDto(response.bag) : null,
      bagItems: response.bagItems.map((item) => this.bagItemToDto(item)),
      totalItems: response.totalItems,
      totalPriceCents: response.totalPriceCents,
      totalPrice: response.totalPriceCents / 100,
    };
  }

  public static toAddItemToBagResponse(
    response: AddItemToBagResponse,
  ): AddItemToBagResponseDto {
    return {
      bag: this.bagToDto(response.bag),
      bagItem: this.bagItemToDto(response.bagItem),
    };
  }

  public static toUpdateItemQuantityResponse(
    response: UpdateItemQuantityResponse,
  ): UpdateItemQuantityResponseDto {
    return {
      bagItem: response.bagItem ? this.bagItemToDto(response.bagItem) : null,
      success: response.success,
      message: response.message,
    };
  }

  public static toRemoveItemFromBagResponse(
    response: RemoveItemFromBagResponse,
  ): RemoveItemFromBagResponseDto {
    return {
      success: response.success,
      message: response.message,
    };
  }

  public static toClearBagResponse(
    response: ClearBagResponse,
  ): ClearBagResponseDto {
    return {
      success: response.success,
      message: response.message,
    };
  }
}
