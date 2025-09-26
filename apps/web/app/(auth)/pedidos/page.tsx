import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { OrderItemRow } from "@/components/order-item-row";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/http";
import type { OrderDTO } from "@/services/orders.service";

export default async function PedidosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login?redirect=/pedidos");
  }

  let data: { orders: OrderDTO[] } = { orders: [] };
  try {
    const response = await api.get<{ orders: OrderDTO[] }>("/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    data = response.data;
  } catch (err: any) {
    const status = err?.status || err?.response?.status;
    const code = err?.code || err?.response?.data?.error;
    if (status === 401 || code === "MISSING_TOKEN" || code === "INVALID_TOKEN") {
      redirect("/login?redirect=/pedidos");
    }
    throw err;
  }

  const orders = data?.orders ?? [];

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-100">
        Meus Pedidos
      </h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-neutral-400">
              Você ainda não fez nenhum pedido.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((pedido) => (
            <Card key={pedido.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-100">
                      Pedido #{pedido.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-neutral-800 text-neutral-200">
                      {pedido.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(pedido.items ?? []).map((it, idx) => (
                    <OrderItemRow key={idx} item={it} />
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
