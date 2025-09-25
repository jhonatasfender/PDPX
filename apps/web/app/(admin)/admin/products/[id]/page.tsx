import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CurrencyFormatter } from "@/lib/format";
import { ProductGallery } from "@/components/product-gallery";
import type { ApiProductWithDetails, ApiProductImage } from "@/types/product";
import { api } from "@/lib/http";
import type { AxiosError } from "axios";

async function getProduct(id: string): Promise<ApiProductWithDetails> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const { data } = await api.get<ApiProductWithDetails>(
      `/admin/products/${id}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    return data;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    if (status === 401) redirect("/login");
    if (status === 404) notFound();
    throw new Error(`Falha ao carregar produto (${status ?? "unknown"})`);
  }
}

export default async function AdminProductViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProduct(id);
  const { product, price, images } = data;

  return (
    <main className="p-4 overflow-x-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-100">
            {product.name}
          </h1>
          <p className="text-sm text-neutral-400">ID: {product.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-800"
          >
            Editar
          </Link>
          <Link
            href={`/produto/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-800"
          >
            Ver na loja
          </Link>
          <Link
            href="/admin/products"
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-800"
          >
            Voltar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-neutral-800 p-4 overflow-x-hidden">
          <div className="mx-auto w-full max-w-full md:max-w-screen-lg overflow-hidden">
            <ProductGallery
              images={images.map((img: Pick<ApiProductImage, "id" | "url" | "alt">) => ({
                id: img.id,
                url: img.url,
                alt: img.alt,
              }))}
            />
          </div>
        </section>

        <aside className="h-fit space-y-3 rounded-lg border border-neutral-800 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Marca</span>
            <span className="text-neutral-100">{product.brand}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">SKU</span>
            <span className="text-neutral-100">{product.sku}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Slug</span>
            <span className="text-neutral-100">/{product.slug}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Estoque</span>
            <span className="text-neutral-100">{product.stock}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Status</span>
            <span className="text-neutral-100">
              {product.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Preço</span>
            <span className="font-semibold text-neutral-50">
              {CurrencyFormatter.formatBRLFromCents(price.amountCents)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Criado em</span>
            <span>{new Date(product.createdAt).toLocaleString("pt-BR")}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Atualizado em</span>
            <span>{new Date(product.updatedAt).toLocaleString("pt-BR")}</span>
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-lg border border-neutral-800 p-4">
        <h2 className="mb-2 text-lg font-medium text-neutral-100">Descrição</h2>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </section>

      <section className="mt-6 rounded-lg border border-neutral-800 p-4">
        <h2 className="mb-3 text-lg font-medium text-neutral-100">Imagens</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-800 text-neutral-400">
              <tr>
                <th className="py-2 pr-4">URL</th>
                <th className="py-2 pr-4">Alt</th>
                <th className="py-2 pr-4">Principal</th>
                <th className="py-2 pr-4">Posição</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img: ApiProductImage) => (
                <tr key={img.id} className="border-b border-neutral-900">
                  <td className="py-2 pr-4 text-neutral-300 break-all">
                    {img.url}
                  </td>
                  <td className="py-2 pr-4 text-neutral-300">
                    {img.alt ?? ""}
                  </td>
                  <td className="py-2 pr-4 text-neutral-300">
                    {img.isPrimary ? "Sim" : "Não"}
                  </td>
                  <td className="py-2 pr-4 text-neutral-300">{img.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
