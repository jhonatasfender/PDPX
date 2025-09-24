"use client";

import { useAuth } from "@/contexts/auth.context";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CurrencyFormatter } from "@/lib/format";

const mockPedidos = [
  {
    id: "1",
    data: "2024-01-15",
    status: "Entregue",
    total: 29990,
    items: [
      { name: "Produto A", quantity: 1, price: 19990 },
      { name: "Produto B", quantity: 2, price: 10000 }
    ]
  },
  {
    id: "2", 
    data: "2024-01-10",
    status: "Em trânsito",
    total: 15990,
    items: [
      { name: "Produto C", quantity: 1, price: 15990 }
    ]
  }
];

export default function PedidosPage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-4xl p-4">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-100">
          Meus Pedidos
        </h1>

        {mockPedidos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-neutral-400">
                Você ainda não fez nenhum pedido.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {mockPedidos.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-100">
                        Pedido #{pedido.id}
                      </h3>
                      <p className="text-sm text-neutral-400">
                        {new Date(pedido.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-100">
                        {CurrencyFormatter.formatBRLFromCents(pedido.total)}
                      </p>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        pedido.status === 'Entregue' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pedido.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pedido.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-neutral-300">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-neutral-100">
                          {CurrencyFormatter.formatBRLFromCents(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
  );
}
