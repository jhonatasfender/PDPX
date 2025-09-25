import {
  ApiProductsResponse,
  ProductsQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  ApiProductWithDetails,
} from "../types/api";
import { api } from "@/lib/http";

class ProductsService {
  public async getProducts(
    params?: ProductsQueryParams,
    options?: { signal?: AbortSignal; timeoutMs?: number },
  ): Promise<ApiProductsResponse> {
    const response = await api.get<ApiProductsResponse>("/admin/products", {
      params,
      signal: options?.signal,
      timeout: options?.timeoutMs,
    });
    return response.data;
  }

  public async getProduct(id: string): Promise<ApiProductWithDetails> {
    const response = await api.get<ApiProductWithDetails>(
      `/admin/products/${id}`,
    );
    return response.data;
  }

  public async createProduct(
    data: CreateProductRequest,
    options?: { signal?: AbortSignal; timeoutMs?: number },
  ): Promise<ApiProductWithDetails> {
    const response = await api.post<ApiProductWithDetails>(
      "/admin/products",
      data,
      {
        signal: options?.signal,
        timeout: options?.timeoutMs,
      },
    );
    return response.data;
  }

  public async updateProduct(
    id: string,
    data: UpdateProductRequest,
  ): Promise<ApiProductWithDetails> {
    const response = await api.put<ApiProductWithDetails>(
      `/admin/products/${id}`,
      data,
    );
    return response.data;
  }

  public async deleteProduct(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/admin/products/${id}`,
    );
    return response.data;
  }
}

export const productsService = new ProductsService();
