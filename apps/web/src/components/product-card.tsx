import Image from "next/image";
import Link from "next/link";
import type { PublicCatalogProductDTO } from "@pdpx/types";
import { ImageOff } from "lucide-react";
import { CurrencyFormatter } from "../lib/format";
import { Carousel } from "./ui/carousel";

type ProductCardProps = {
  product: PublicCatalogProductDTO;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const images = (product.images || []).filter(
    (img) =>
      img &&
      typeof img.url === "string" &&
      (img.url.startsWith("http") || img.url.startsWith("/")) &&
      img.url !== "string",
  );
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition-colors hover:bg-neutral-900/90"
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-800">
        {images.length > 0 ? (
          <Carousel autoplay slideClassName="">
            {images.map((img, idx) => (
              <div key={img.id} className="relative h-full w-full">
                <Image
                  src={img.url}
                  alt={img.alt ?? product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={priority && idx === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-600">
            <ImageOff size={22} aria-hidden="true" />
            <span className="sr-only">Sem imagem</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h2 className="line-clamp-2 text-sm font-medium text-neutral-100">
          {product.name}
        </h2>
        <p className="text-xs text-neutral-400">{product.brand}</p>
        <div className="mt-2 text-base font-semibold text-neutral-50">
          {CurrencyFormatter.formatBRLFromCents(product.price.amountCents)}
        </div>
      </div>
    </Link>
  );
}
