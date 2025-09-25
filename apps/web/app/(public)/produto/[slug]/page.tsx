import Link from "next/link";
import type { Metadata } from "next";
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
import { Button } from "@/components/ui/button";
import { RadioSwatch } from "@/components/ui/radio-swatch";
import { ProductGallery } from "@/components/product-gallery";
import { CurrencyFormatter } from "@/lib/format";

export default async function PDPPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  let product: PublicCatalogProductDTO | null = null;
  try {
    const { data } = await api.get<PublicCatalogProductDTO>(
      `/public/products/${slug}`,
      {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      },
    );
    product = data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      notFound();
    }
    throw err;
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const primary = images.find((i) => i.isPrimary) ?? images[0];
  const gallery = primary ? images.filter((i) => i.id !== primary.id) : images;

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:px-6">
      <section>
        {images.length > 0 ? (
          <ProductGallery images={primary ? [primary, ...gallery] : images} />
        ) : (
          <div className="flex h-[360px] w-full items-center justify-center rounded-md border border-neutral-800 text-neutral-500">
            Sem imagens
          </div>
        )}
      </section>

      <section className="space-y-5 md:space-y-6">
        <nav className="-mb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/40 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-neutral-900"
            aria-label="Voltar ao catálogo"
            data-cy="pdp-back"
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
          <article
            className="prose prose-invert max-w-none p-5 text-sm leading-relaxed text-neutral-300"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: product } = await api.get<PublicCatalogProductDTO>(
      `/public/products/${slug}`,
    );

    const baseTitle = `${product.name} — ${product.brand} | PDPX`;
    const paddedTitle =
      baseTitle.length < 30 ? `${baseTitle} · Comprar online` : baseTitle;
    const title =
      paddedTitle.length > 60
        ? `${paddedTitle.slice(0, 57).trimEnd()}...`
        : paddedTitle;

    const plainDesc = product.description
      ? product.description
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";
    const priceText = product.price
      ? `Preço ${CurrencyFormatter.formatBRLFromCents(product.price.amountCents)}. `
      : "";
    let description =
      `${product.name} da ${product.brand}. ${priceText}${plainDesc}`.trim();
    if (description.length < 55) {
      description = `${product.name} da ${product.brand}. ${priceText}Entrega rápida, 1 ano de garantia e troca em 30 dias.`;
    }
    if (description.length > 200) {
      description = `${description.slice(0, 197).trimEnd()}...`;
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    const pagePath = `/produto/${product.slug}`;
    const ogImageUrl = siteUrl
      ? `${siteUrl}${pagePath}/opengraph-image`
      : `${pagePath}/opengraph-image`;

    return {
      title,
      description,
      alternates: { canonical: siteUrl ? `${siteUrl}${pagePath}` : pagePath },
      openGraph: {
        type: "website",
        title,
        description,
        url: siteUrl ? `${siteUrl}${pagePath}` : pagePath,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {};
  }
}
