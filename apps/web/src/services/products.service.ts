import {
  ApiProductsResponse,
  ProductsQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  ApiProductWithDetails,
  DeleteProductResponse,
  ToggleProductStatusResponse,
} from "../types/product";
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
    options?: { signal?: AbortSignal; timeoutMs?: number },
  ): Promise<ApiProductWithDetails> {
    const response = await api.put<ApiProductWithDetails>(
      `/admin/products/${id}`,
      data,
      {
        signal: options?.signal,
        timeout: options?.timeoutMs || 30000,
      },
    );
    return response.data;
  }

  public async deleteProduct(id: string): Promise<DeleteProductResponse> {
    const response = await api.delete<DeleteProductResponse>(
      `/admin/products/${id}`,
    );
    return response.data;
  }

  public async toggleProductStatus(
    id: string,
  ): Promise<ToggleProductStatusResponse> {
    const response = await api.patch<ToggleProductStatusResponse>(
      `/admin/products/${id}/toggle-status`,
    );
    return response.data;
  }
}

export const productsService = new ProductsService();
