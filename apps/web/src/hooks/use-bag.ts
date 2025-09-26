"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bagService } from "../services/bag.service";
import type { PublicCatalogProductDTO } from "@pdpx/types";
import { toast } from "sonner";
import type {
  GetBagResponse,
  AddItemToBagRequest,
  UpdateItemQuantityRequest,
  RemoveItemFromBagRequest,
} from "../types/bag";

export function useBag() {
  const queryClient = useQueryClient();

  const bagQuery = useQuery<GetBagResponse>({
    queryKey: ["bag"],
    queryFn: () => bagService.getBag(),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
    gcTime: 300_000,
    placeholderData: (prev) => prev as GetBagResponse | undefined,
  });

  const productsForItems = useQuery<{
    [productId: string]: PublicCatalogProductDTO | null;
  }>({
    queryKey: [
      "bag-products",
      bagQuery.data?.bagItems?.map((i) => i.productId).join(","),
    ],
    enabled: (bagQuery.data?.bagItems?.length ?? 0) > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        (bagQuery.data?.bagItems ?? []).map(async (i) => {
          const p = await bagService.getPublicProduct(i.productId);
          return [i.productId, p] as const;
        }),
      );
      return Object.fromEntries(entries);
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: AddItemToBagRequest) => {
      return await bagService.addItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
      toast.success("Item adicionado ao carrinho");
    },
    onError: (error: any) => {
      const code = error?.code || error?.response?.data?.error;
      if (code === "MISSING_TOKEN") {
        if (typeof window !== "undefined") {
          const current = window.location.pathname + window.location.search;
          const redirect = encodeURIComponent(current);
          window.location.href = `/login?redirect=${redirect}`;
          return;
        }
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao adicionar item ao carrinho";
      toast.error(errorMessage);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async (data: UpdateItemQuantityRequest) => {
      return await bagService.updateItemQuantity(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
      toast.success("Quantidade atualizada");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao atualizar quantidade";
      toast.error(errorMessage);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (data: RemoveItemFromBagRequest) => {
      return await bagService.removeItem(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
      toast.success("Item removido do carrinho");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao remover item";
      toast.error(errorMessage);
    },
  });

  const clearBagMutation = useMutation({
    mutationFn: async () => {
      return await bagService.clearBag();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
      toast.success("Carrinho limpo");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao limpar carrinho";
      toast.error(errorMessage);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return await bagService.checkout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bag"] });
      toast.success("Compra finalizada");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Erro no checkout";
      toast.error(errorMessage);
    },
  });

  const addItem = async (productId: string, quantity: number = 1) => {
    await addItemMutation.mutateAsync({ productId, quantity });
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ productId, quantity });
  };

  const removeItem = async (productId: string) => {
    await removeItemMutation.mutateAsync({ productId });
  };

  const clearBag = async () => {
    await clearBagMutation.mutateAsync();
  };

  const checkout = async () => {
    await checkoutMutation.mutateAsync();
  };

  return {
    bag: bagQuery.data?.bag ?? null,
    bagItems: bagQuery.data?.bagItems ?? [],
    bagProductsMap: productsForItems.data ?? {},
    totalItems: bagQuery.data?.totalItems ?? 0,
    totalPrice: bagQuery.data?.totalPrice ?? 0,
    isLoading: bagQuery.isLoading,
    isError: bagQuery.isError,
    error: bagQuery.error,
    refetch: bagQuery.refetch,
    addItem,
    updateItemQuantity,
    removeItem,
    clearBag,
    isAdding: addItemMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearBagMutation.isPending,
    checkout,
    isCheckingOut: checkoutMutation.isPending,
  };
}
