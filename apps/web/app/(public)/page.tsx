"use client";

import { mockProducts } from "@/mocks/catalog";
import { ProductCard } from "@/components/product-card";
import CatalogFilters from "@/components/catalog-filters";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function HomeContent() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-6xl p-4">
      {user ? (
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            Bem-vindo, {user.name || user.email}!
          </h1>
          <p className="text-neutral-400">
            Explore nossos produtos e faça suas compras.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/carrinho">
              <Button variant="secondary" size="sm">
                Ver Carrinho
              </Button>
            </Link>
            <Link href="/pedidos">
              <Button variant="secondary" size="sm">
                Meus Pedidos
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" size="sm">
                Meu Perfil
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            Catálogo de Produtos
          </h1>
          <p className="text-neutral-400">
            Faça login para ter acesso a funcionalidades exclusivas como carrinho de compras e histórico de pedidos.
          </p>
          <div className="mt-4">
            <Link href="/login">
              <Button size="sm">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      )}
      
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
