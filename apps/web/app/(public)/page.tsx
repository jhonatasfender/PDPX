"use client";

import { mockProducts } from "@/mocks/catalog";
import { ProductCard } from "@/components/product-card";
import CatalogFilters from "@/components/catalog-filters";

function HomeContent() {
  return (
    <main className="mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <CatalogFilters />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return <HomeContent />;
}
