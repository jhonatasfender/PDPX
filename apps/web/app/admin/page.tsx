import {
  CategoryBarChart,
  ChannelPieChart,
  SalesLineChart,
} from "@/components/admin/charts";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 p-4 lg:col-span-2">
          <div className="mb-3 text-sm text-neutral-400">
            Vendas (últimos 6 meses)
          </div>
          <SalesLineChart />
        </div>
        <div className="rounded-lg border border-neutral-800 p-4">
          <div className="mb-3 text-sm text-neutral-400">Canais</div>
          <ChannelPieChart />
        </div>
      </div>
      <div className="rounded-lg border border-neutral-800 p-4">
        <div className="mb-3 text-sm text-neutral-400">
          Categorias com mais vendas
        </div>
        <CategoryBarChart />
      </div>
    </div>
  );
}
