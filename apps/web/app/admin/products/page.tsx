import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductsTable } from "@/components/admin/products-table";

export default function AdminProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
        <Link href="/admin/products/new">
          <Button variant="secondary" size="sm">
            Novo produto
          </Button>
        </Link>
      </div>

      <ProductsTable />
    </div>
  );
}
