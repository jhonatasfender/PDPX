import { api } from "@/lib/http";
import type {
  GetBagResponse,
  AddItemToBagRequest,
  AddItemToBagResponse,
  UpdateItemQuantityRequest,
  UpdateItemQuantityResponse,
  RemoveItemFromBagRequest,
  RemoveItemFromBagResponse,
  ClearBagResponse,
} from "@/types/bag";

class BagService {
  public async getBag(): Promise<GetBagResponse> {
    const response = await api.get<GetBagResponse>("/bag");
    return response.data;
  }

  public async addItem(data: AddItemToBagRequest): Promise<AddItemToBagResponse> {
    const response = await api.post<AddItemToBagResponse>("/bag/items", data);
    return response.data;
  }

  public async updateItemQuantity(
    data: UpdateItemQuantityRequest,
  ): Promise<UpdateItemQuantityResponse> {
    const response = await api.put<UpdateItemQuantityResponse>(
      "/bag/items/quantity",
      data,
    );
    return response.data;
  }

  public async removeItem(
    data: RemoveItemFromBagRequest,
  ): Promise<RemoveItemFromBagResponse> {
    const response = await api.delete<RemoveItemFromBagResponse>("/bag/items", {
      data,
    });
    return response.data;
  }

  public async clearBag(): Promise<ClearBagResponse> {
    const response = await api.delete<ClearBagResponse>("/bag");
    return response.data;
  }
}

export const bagService = new BagService();
