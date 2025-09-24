import Image from "next/image";
import Link from "next/link";
import { mockCart } from "@/mocks/cart";
import { CurrencyFormatter } from "@/lib/format";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth-guard";

export default function CartPage() {
  const subtotalCents = mockCart.reduce(
    (acc, item) => acc + item.product.price.amountCents * item.quantity,
    0,
  );

  return (
    <AuthGuard requireAuth={true}>
      <main className="mx-auto max-w-5xl p-4">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-100">
          Seu carrinho
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
          <section className="space-y-4">
            {mockCart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 rounded-lg border border-neutral-800 p-3"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-neutral-800">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/produto/${item.product.slug}`}
                      className="block truncate text-sm font-medium text-neutral-100 hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-neutral-400">
                      {item.product.brand}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border border-neutral-800 px-2 py-1 text-sm text-neutral-100">
                      {item.quantity}x
                    </div>
                    <div className="w-24 text-right text-sm font-semibold text-neutral-50">
                      {CurrencyFormatter.formatBRLFromCents(
                        item.product.price.amountCents * item.quantity,
                      )}
                    </div>
                    <button
                      aria-label="Remover"
                      className="rounded-md border border-neutral-800 p-2 text-neutral-300 hover:bg-neutral-900/60 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {mockCart.length === 0 && (
              <p className="text-sm text-neutral-400">
                Seu carrinho está vazio.
              </p>
            )}
          </section>

          <aside className="h-fit space-y-3 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-300">Subtotal</span>
              <span className="font-semibold text-neutral-50">
                {CurrencyFormatter.formatBRLFromCents(subtotalCents)}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Frete e impostos calculados na finalização.
            </p>
            <Button className="w-full" size="lg">
              Finalizar compra
            </Button>
            <Link
              href="/"
              className="block text-center text-xs text-neutral-400 hover:text-neutral-100 cursor-pointer"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      </main>
    </AuthGuard>
  );
}
