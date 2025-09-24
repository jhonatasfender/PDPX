import { ApiProductsResponse, ProductsQueryParams, CreateProductRequest, UpdateProductRequest, ApiProductWithDetails } from '../types/api';
import { api } from '@/lib/http';

class ProductsService {
  async getProducts(params?: ProductsQueryParams): Promise<ApiProductsResponse> {
    const response = await api.get<ApiProductsResponse>('/admin/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<ApiProductWithDetails> {
    const response = await api.get<ApiProductWithDetails>(`/admin/products/${id}`);
    return response.data;
  }

  async createProduct(data: CreateProductRequest): Promise<ApiProductWithDetails> {
    const response = await api.post<ApiProductWithDetails>('/admin/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: UpdateProductRequest): Promise<ApiProductWithDetails> {
    const response = await api.put<ApiProductWithDetails>(`/admin/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/admin/products/${id}`);
    return response.data;
  }
}

export const productsService = new ProductsService();
