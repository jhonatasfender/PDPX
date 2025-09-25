"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ImageOff, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CurrencyFormatter } from "../../lib/format";
import { useBagContext } from "../../contexts/bag.context";
import type { BagItem } from "../../types/bag";

type BagItemProps = {
  item: BagItem;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{
      id: string;
      url: string;
      alt?: string | null;
    }>;
  };
};

export function BagItemComponent({ item, product }: BagItemProps) {
  const { updateItemQuantity, removeItem } = useBagContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      setIsRemoving(true);
      try {
        await removeItem(item.productId);
      } finally {
        setIsRemoving(false);
      }
    } else {
      setIsUpdating(true);
      try {
        await updateItemQuantity(item.productId, newQuantity);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const image = product?.images?.find(
    (img) =>
      img.url &&
      img.url !== "string" &&
      (img.url.startsWith("http") || img.url.startsWith("/")),
  );

  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-800">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product?.name ?? "Produto"}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-600">
            <ImageOff size={18} aria-hidden="true" />
            <span className="sr-only">Sem imagem</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="line-clamp-1 font-medium text-neutral-100">
          {product?.name ?? "Produto"}
        </h3>
        <p className="text-sm text-neutral-400">
          {CurrencyFormatter.formatBRLFromCents(item.priceCents)} cada
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating}
          className="h-8 w-8 p-0"
        >
          {isUpdating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Minus size={14} />
          )}
        </Button>

        <span className="min-w-[2rem] text-center text-sm font-medium text-neutral-100">
          {item.quantity}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="h-8 w-8 p-0"
        >
          {isUpdating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
        </Button>
      </div>

      <div className="text-right">
        <p className="font-medium text-neutral-100">
          {CurrencyFormatter.formatBRLFromCents(item.totalPriceCents)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          setIsRemoving(true);
          try {
            await removeItem(item.productId);
          } finally {
            setIsRemoving(false);
          }
        }}
        disabled={isRemoving}
        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
      >
        {isRemoving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </Button>
    </div>
  );
}
