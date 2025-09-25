import { AdminProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
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
      <h1 className="text-2xl font-semibold tracking-tight">
        Editar produto #{id}
      </h1>
      <div
        className="rounded-lg border border-neutral-800 p-4"
        data-cy="admin-edit-form"
      >
        <AdminProductForm submitLabel="Salvar alterações" />
      </div>
    </div>
  );
}
