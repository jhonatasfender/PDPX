import { ShoppingCart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-100">Carrinho</h1>
      </div>
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-12 text-center">
        <ShoppingCart size={48} className="mx-auto mb-4 text-neutral-600" />
        <h2 className="mb-2 text-xl font-semibold text-neutral-100">
          Seu carrinho está vazio
        </h2>
        <p className="text-neutral-400">
          Adicione alguns produtos para começar suas compras
        </p>
      </div>
    </div>
  );
}
