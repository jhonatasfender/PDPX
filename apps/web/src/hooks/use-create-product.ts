"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { productsService } from "@/services/products.service";
import type { CreateProductRequest } from "@/types/api";

export type NewProductFormValues = {
  name: string;
  brand: string;
  sku: string;
  description: string;
  stock: number | string;
  price: number | string;
  isActive: "true" | "false";
  images?: Array<{
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number | string;
  }>;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: NewProductFormValues) => {
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
        images: (values.images ?? []).map((img, idx) => ({
          url: img.url,
          alt: img.alt ?? null,
          isPrimary: Boolean(img.isPrimary),
          position: Number(img.position ?? idx),
        })),
        isActive: values.isActive === "true",
      } satisfies CreateProductRequest;
      return await productsService.createProduct(payload, {
        timeoutMs: 30000,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      router.push("/admin/products");
    },
  });

  return {
    createProduct: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}
