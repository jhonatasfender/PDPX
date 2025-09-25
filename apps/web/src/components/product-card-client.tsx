"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicCatalogProductDTO } from "@pdpx/types";
import { ImageOff } from "lucide-react";
import { CurrencyFormatter } from "../lib/format";
import { Carousel } from "./ui/carousel";
import { AddToBagIcon } from "./bag/add-to-bag-icon";

type ProductCardClientProps = {
  product: PublicCatalogProductDTO;
  priority?: boolean;
};

export function ProductCardClient({ product, priority = false }: ProductCardClientProps) {
  const images = (product.images || []).filter(
    (img) =>
      img &&
      typeof img.url === "string" &&
      (img.url.startsWith("http") || img.url.startsWith("/")) &&
      img.url !== "string",
  );

  return (
    <div className="group relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition-colors hover:bg-neutral-900/90">
      <Link href={`/produto/${product.slug}`} className="block">
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
      </Link>
      
      <div className="p-3">
        <Link href={`/produto/${product.slug}`}>
          <h2 className="line-clamp-2 text-sm font-medium text-neutral-100">
            {product.name}
          </h2>
          <p className="text-xs text-neutral-400">{product.brand}</p>
        </Link>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-base font-semibold text-neutral-50">
            {CurrencyFormatter.formatBRLFromCents(product.price.amountCents)}
          </div>
          
          <div 
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <AddToBagIcon productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
