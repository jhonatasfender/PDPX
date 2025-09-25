"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { productsService } from "../services/products.service";
import { toast } from "sonner";
import { slugify } from "../lib/utils";
import type {
  ApiProductsResponse,
  ApiProductWithDetails,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsQueryParams,
} from "../types/product";

export function useProducts(params?: ProductsQueryParams, productId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const productsQuery = useQuery<ApiProductsResponse>({
    queryKey: ["admin-products", params?.page, params?.limit],
    queryFn: ({ signal }) =>
      productsService.getProducts(params, { signal, timeoutMs: 10000 }),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev as ApiProductsResponse | undefined,
    enabled: !productId,
  });

  const productQuery = useQuery<ApiProductWithDetails>({
    queryKey: ["admin-product", productId],
    queryFn: () => productsService.getProduct(productId!),
    enabled: !!productId,
  });
  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      return await productsService.createProduct(data, { timeoutMs: 30000 });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produto criado com sucesso");
      router.push("/admin/products");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Erro ao criar produto";
      toast.error(errorMessage);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductRequest }) => {
      return await productsService.updateProduct(id, data, { timeoutMs: 30000 });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Produto atualizado com sucesso");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Erro ao atualizar produto";
      toast.error(errorMessage);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await productsService.deleteProduct(productId);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(data.message || "Produto deletado com sucesso");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Erro ao deletar produto";
      toast.error(errorMessage);
    },
  });

  const toggleProductStatusMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await productsService.toggleProductStatus(productId);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(data.message);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Erro ao alterar status do produto";
      toast.error(errorMessage);
    },
  });
  const createProductFromForm = async (values: any) => {
    const payload = {
      slug: slugify(values.name || values.sku),
      name: values.name,
      brand: values.brand,
      sku: values.sku,
      description: values.description,
      stock: Number(values.stock),
      price: {
        currency: "BRL",
        amountCents: Math.round(Number(values.price) * 100),
      },
      images: (values.images ?? []).map((img: any, idx: number) => ({
        url: img.url,
        alt: img.alt ?? null,
        isPrimary: Boolean(img.isPrimary),
        position: Number(img.position ?? idx),
      })),
      isActive: values.isActive === "true",
    } satisfies CreateProductRequest;
    
    return await createProductMutation.mutateAsync(payload);
  };

  return {
    products: productsQuery.data?.products ?? [],
    total: productsQuery.data?.total ?? 0,
    totalPages: productsQuery.data?.totalPages ?? 1,
    currentPage: productsQuery.data?.page ?? 1,
    product: productQuery.data,
    isLoading: productId ? productQuery.isLoading : productsQuery.isLoading,
    isFetching: productId ? productQuery.isFetching : productsQuery.isFetching,
    isError: productId ? productQuery.isError : productsQuery.isError,
    error: productId ? productQuery.error : productQuery.error,
    refetch: productId ? productQuery.refetch : productsQuery.refetch,
    createProduct: createProductMutation.mutateAsync,
    createProductFromForm,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    toggleProductStatus: toggleProductStatusMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isToggling: toggleProductStatusMutation.isPending,
  };
}
