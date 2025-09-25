import { ProductCard } from "@/components/product-card";
import CatalogFilters from "@/components/catalog-filters";
import { cookies } from "next/headers";
import { api } from "@/lib/http";
import type { PublicCatalogProductDTO } from "@pdpx/types";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const { data } = await api.get<{ products: PublicCatalogProductDTO[] }>(
    "/public/products",
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  const { data: filters } = await api.get<{
    brands: string[];
    price: { minCents: number; maxCents: number };
  }>("/public/filters", {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const products: PublicCatalogProductDTO[] = data.products;

  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <CatalogFilters brands={filters.brands} price={filters.price} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: PublicCatalogProductDTO, idx: number) => (
            <ProductCard key={p.id} product={p} priority={idx < 3} />
          ))}
        </div>
      </div>
    </main>
  );
}
