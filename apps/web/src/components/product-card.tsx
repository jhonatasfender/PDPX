import Image from "next/image";
import Link from "next/link";
import type { MockProduct } from "../mocks/types";
import { CurrencyFormatter } from "../lib/format";

type ProductCardProps = {
  product: MockProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const img = product.images[0];
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 transition-colors hover:bg-neutral-900/90"
    >
      <div className="relative aspect-[4/3] w-full bg-neutral-800">
        {img && (
          <Image
            src={img.url}
            alt={img.alt ?? product.name}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
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
