import { AdminProductForm } from "@/components/admin/product-form";

export default function AdminProductNewPage() {
  return (
    <div className="space-y-4" data-cy="admin-new-product-page">
      <h1 className="text-2xl font-semibold tracking-tight">Novo produto</h1>
      <div
        className="rounded-lg border border-neutral-800 p-4"
        data-cy="admin-new-product-form"
      >
        <AdminProductForm submitLabel="Criar produto" />
      </div>
    </div>
  );
}
