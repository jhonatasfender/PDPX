import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { api } from "@/lib/http";
import type { PublicCatalogProductDTO } from "@pdpx/types";
import {
  ShoppingCart,
  Truck,
  ChevronLeft,
  Shield,
  RefreshCcw,
  Star,
  BadgePercent,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { RadioSwatch } from "@/components/ui/radio-swatch";
import { ProductGallery } from "@/components/product-gallery";
import { CurrencyFormatter } from "@/lib/format";

export default async function PDPPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const { data } = await api.get<{ products: PublicCatalogProductDTO[] }>(
    "/public/products",
    {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      params: { search: slug },
    },
  );

  const product = (data.products || []).find((p) => p.slug === slug);
  if (!product) notFound();

  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const gallery = product.images.filter((i) => i.id !== primary.id);

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:px-6">
      <section>
        <ProductGallery images={[primary, ...gallery]} />
      </section>

      <section className="space-y-5 md:space-y-6">
        <nav className="-mb-1">
          <Link
            href="/"
            className={
              buttonVariants({ variant: "secondary", size: "sm" }) +
              " inline-flex items-center gap-2"
            }
          >
            <ChevronLeft size={16} /> Voltar ao catálogo
          </Link>
        </nav>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">
            {product.name}
          </h1>
          <p className="text-sm text-neutral-400">{product.brand}</p>
        </div>

        <div className="mt-1 flex items-center gap-2 md:gap-3">
          <span className="text-3xl font-bold text-neutral-50">
            {CurrencyFormatter.formatBRLFromCents(product.price.amountCents)}
          </span>
          <span className="text-sm line-through text-neutral-500">
            {CurrencyFormatter.formatBRLFromCents(
              Math.round(product.price.amountCents * 1.12),
            )}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-green-800/40 bg-green-900/20 px-2 py-1 text-xs text-green-300">
            <BadgePercent size={14} /> 12% off
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <div className="inline-flex items-center gap-1 text-amber-300">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} className="text-neutral-600" />
          </div>
          <span>(128 avaliações)</span>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-neutral-800 p-2.5 text-neutral-300 md:p-3">
          <Truck size={18} />
          <span>Entrega rápida para sua região</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-neutral-400">Acabamento</p>
            <RadioSwatch
              name="acabamento"
              options={[
                {
                  value: "linho-claro",
                  label: "Linho Claro",
                  color: "#d4d4d4",
                },
                {
                  value: "linho-grafite",
                  label: "Linho Grafite",
                  color: "#4b5563",
                },
                {
                  value: "madeira-carvalho",
                  label: "Madeira Carvalho",
                  color: "#a16207",
                },
              ]}
              defaultValue="linho-claro"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-neutral-400">Configuração</p>
            <div className="flex flex-wrap gap-2">
              {["Chaise esquerda", "Chaise direita", "Sem chaise"].map(
                (cfg) => (
                  <Button key={cfg} variant="chip" size="sm">
                    {cfg}
                  </Button>
                ),
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:gap-3">
            <Button size="lg" className="w-full gap-2">
              <ShoppingCart size={18} /> Adicionar ao carrinho
            </Button>
            <Button variant="secondary" size="lg" className="w-full">
              Comprar agora
            </Button>
          </div>
        </div>

        <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800">
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 md:gap-4 md:p-5">
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Shield size={18} /> 1 ano de garantia
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <RefreshCcw size={18} /> Troca em 30 dias
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Truck size={18} /> Frete rápido
            </div>
          </div>
          <article className="prose prose-invert max-w-none p-5 text-sm leading-relaxed text-neutral-300">
            {product.description}
          </article>
        </div>
      </section>
    </main>
  );
}
