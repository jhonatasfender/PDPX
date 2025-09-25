"use client";

import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CurrencyFormatter } from "../../lib/format";
import { useBagContext } from "../../contexts/bag.context";

export function BagSummary() {
  const { bagItems, totalItems, totalPrice, clearBag, isClearing } = useBagContext();

  if (bagItems.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center">
        <ShoppingCart size={32} className="mx-auto mb-3 text-neutral-600" />
        <p className="text-neutral-400">Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">
          Resumo do Carrinho
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearBag}
          disabled={isClearing}
          className="text-red-400 hover:text-red-300"
        >
          {isClearing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          {isClearing ? "Limpando..." : "Limpar"}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-neutral-400">
          <span>Itens ({totalItems})</span>
          <span>{CurrencyFormatter.formatBRLFromCents(totalPrice * 100)}</span>
        </div>

        <div className="border-t border-neutral-800 pt-3">
          <div className="flex justify-between text-lg font-semibold text-neutral-100">
            <span>Total</span>
            <span>{CurrencyFormatter.formatBRLFromCents(totalPrice * 100)}</span>
          </div>
        </div>
      </div>

      <Button className="mt-6 w-full" size="lg">
        Finalizar Compra
      </Button>
    </div>
  );
}
