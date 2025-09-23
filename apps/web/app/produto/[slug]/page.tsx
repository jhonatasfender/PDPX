import Image from "next/image";
import Link from "next/link";
import { mockProduct } from "../../../src/mocks/pdp";
import {
  ShoppingCart,
  Truck,
  ChevronLeft,
  Shield,
  RefreshCcw,
  Star,
  BadgePercent,
} from "lucide-react";
import { Button } from "../../../src/components/ui/button";
import { RadioSwatch } from "../../../src/components/ui/radio-swatch";
import { CurrencyFormatter } from "../../../src/lib/format";

export default async function PDPPage() {
  const product = mockProduct;

  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const gallery = product.images.filter((i) => i.id !== primary.id);

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:px-6">
      <section>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.alt ?? product.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3 md:mt-4 md:gap-4">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-md bg-neutral-800 ring-1 ring-transparent hover:ring-neutral-600"
            >
              <Image
                src={img.url}
                alt={img.alt ?? product.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 md:space-y-6">
        <nav className="-mb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-neutral-100"
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
                  <button
                    key={cfg}
                    className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900/60"
                  >
                    {cfg}
                  </button>
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
