"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useBagContext } from "../../contexts/bag.context";

type AddToBagIconProps = {
  productId: string;
  className?: string;
};

export function AddToBagIcon({ productId, className }: AddToBagIconProps) {
  const { addItem, bagItems } = useBagContext();
  const [isAdding, setIsAdding] = useState(false);

  const existingItem = bagItems.find(item => item.productId === productId);
  const isInBag = !!existingItem;

  const handleAddToBag = async () => {
    setIsAdding(true);
    try {
      await addItem(productId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  if (isInBag) {
    return (
      <Button
        variant="secondary"
        size="sm"
        disabled
        className={`h-8 w-8 p-0 ${className}`}
        title="No carrinho"
      >
        <Check size={14} className="text-green-400" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddToBag}
      disabled={isAdding}
      className={`h-8 w-8 p-0 hover:bg-neutral-800 ${className}`}
      title={isAdding ? "Adicionando..." : "Adicionar ao carrinho"}
    >
      {isAdding ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <ShoppingCart size={14} />
      )}
    </Button>
  );
}
