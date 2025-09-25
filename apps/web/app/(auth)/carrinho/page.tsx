"use client";

import { notFound } from "next/navigation";
import { useBagContext } from "@/contexts/bag.context";
import { BagItemComponent } from "@/components/bag/bag-item";
import { BagSummary } from "@/components/bag/bag-summary";

export default function CarrinhoPage() {
  const { bagItems } = useBagContext();

  if (bagItems.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-100">Carrinho</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {bagItems.map((item) => (
              <BagItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <BagSummary />
        </div>
      </div>
    </div>
  );
}
