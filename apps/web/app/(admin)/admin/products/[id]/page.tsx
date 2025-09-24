type Props = { params: Promise<{ id: string }> };

export default async function AdminProductViewPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Produto #{id}</h1>
      <div className="rounded-lg border border-neutral-800 p-4">
        Detalhes do produto (placeholder)
      </div>
    </div>
  );
}
