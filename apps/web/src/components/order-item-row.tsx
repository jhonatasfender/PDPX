"use client";

import Image from "next/image";

export type OrderItem = {
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ id: string; url: string; alt?: string | null }>;
  };
  quantity: number;
  priceCents: number;
};

export function OrderItemRow({ item }: { item: OrderItem }) {
  const thumb = item.product.images?.[0];
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-800">
        {thumb?.url ? (
          <Image
            src={thumb.url}
            alt={thumb.alt ?? item.product.name}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex-1">
        <p className="text-sm text-neutral-200 line-clamp-1">
          {item.quantity}x {item.product.name}
        </p>
      </div>
    </div>
  );
}
