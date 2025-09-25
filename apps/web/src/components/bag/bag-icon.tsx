"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useBagContext } from "../../contexts/bag.context";

type BagIconProps = {
  className?: string;
};

export function BagIcon({ className }: BagIconProps) {
  const { totalItems } = useBagContext();

  return (
    <Link
      href="/carrinho"
      className={`relative flex items-center justify-center ${className}`}
    >
      <ShoppingCart size={20} className="text-neutral-300" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
