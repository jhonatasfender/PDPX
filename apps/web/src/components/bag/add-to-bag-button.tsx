"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useBagContext } from "../../contexts/bag.context";

type AddToBagButtonProps = {
  productId: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function AddToBagButton({
  productId,
  className,
  variant = "primary",
  size = "md",
}: AddToBagButtonProps) {
  const { addItem, bagItems } = useBagContext();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const existingItem = bagItems.find((item) => item.productId === productId);
  const isInBag = !!existingItem;

  const handleAddToBag = async () => {
    setIsAdding(true);
    try {
      await addItem(productId, quantity);
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (isInBag) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="secondary" size={size} className={className} disabled>
          <ShoppingCart size={16} />
          No Carrinho
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="h-8 w-8 p-0"
        >
          <Minus size={14} />
        </Button>

        <span className="min-w-[2rem] text-center text-sm font-medium text-neutral-100">
          {quantity}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(quantity + 1)}
          className="h-8 w-8 p-0"
        >
          <Plus size={14} />
        </Button>
      </div>

      <Button
        variant={variant}
        size={size}
        onClick={handleAddToBag}
        disabled={isAdding}
        className={className}
      >
        {isAdding ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ShoppingCart size={16} />
        )}
        {isAdding ? "Adicionando..." : "Adicionar ao Carrinho"}
      </Button>
    </div>
  );
}
