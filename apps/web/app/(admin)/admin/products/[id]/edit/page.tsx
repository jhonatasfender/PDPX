"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminProductForm } from "@/components/admin/product-form";
import { useProducts } from "@/hooks/use-products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { product, updateProduct, isUpdating } = useProducts(
    undefined,
    productId,
  );

  const handleUpdate = async (values: any) => {
    const updateData = {
      name: values.name,
      brand: values.brand,
      sku: values.sku,
      description: values.description,
      stock: values.stock,
      isActive: values.isActive === "true",
      price: {
        currency: "BRL",
        amountCents: Math.round(values.price * 100),
      },
      images:
        values.images?.map((img: any, index: number) => ({
          url: img.url,
          alt: img.alt || null,
          isPrimary: img.isPrimary || false,
          position: img.position || index,
        })) || [],
    };

    await updateProduct({ id: productId, data: updateData });
    toast.success("Produto atualizado com sucesso");
    router.push("/admin/products");
  };

  const defaultValues = {
    name: product?.product.name || "",
    brand: product?.product.brand || "",
    sku: product?.product.sku || "",
    price: (product?.price.amountCents || 0) / 100,
    stock: product?.product.stock || 0,
    isActive: (product?.product.isActive ? "true" : "false") as
      | "true"
      | "false",
    description: product?.product.description || "",
    images:
      product?.images?.map((img, index) => ({
        url: img.url,
        alt: img.alt || "",
        isPrimary: img.isPrimary || false,
        position: img.position || index,
      })) || [],
  };

  return (
    <div className="space-y-4">
      <nav className="-mb-2" data-cy="admin-edit-nav">
        <Link href="/admin/products" data-cy="admin-edit-back">
          <Button
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Voltar
          </Button>
        </Link>
      </nav>
      <h1 className="text-2xl pt-4 font-semibold tracking-tight">
        Editar produto
      </h1>
      <div
        className="rounded-lg border border-neutral-800 p-4"
        data-cy="admin-edit-form"
      >
        <AdminProductForm
          defaultValues={defaultValues}
          onSubmit={handleUpdate}
          submitLabel={isUpdating ? "Salvando..." : "Salvar alterações"}
        />
      </div>
    </div>
  );
}
