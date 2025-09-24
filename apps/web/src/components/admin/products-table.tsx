"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productsService } from "../../services/products.service";
import { ApiProductWithDetails } from "../../types/api";
import { CurrencyFormatter } from "../../lib/format";
import { Button } from "../ui/button";
import { Table, THead, TBody, TR, TH, TD } from "../ui/table";
import { Eye, Pencil, Power, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ProductsTable() {
  const [products, setProducts] = useState<ApiProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsService.getProducts();
        setProducts(response.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando produtos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800/40 bg-red-900/20 p-4">
        <p className="text-red-300">Erro: {error}</p>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800 p-8 text-center">
        <p className="text-neutral-400">Nenhum produto encontrado</p>
      </div>
    );
  }
  return (
    <Table>
      <THead>
        <TR>
          <TH>Produto</TH>
          <TH>Marca</TH>
          <TH>SKU</TH>
          <TH>Estoque</TH>
          <TH>Status</TH>
          <TH>Preço</TH>
          <TH className="text-right">Ações</TH>
        </TR>
      </THead>
      <TBody>
        {products.map((productData) => {
          const { product, images, price } = productData;
          const img = images[0];
          return (
            <TR key={product.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded-md bg-neutral-800">
                    {img && img.url && img.url !== "string" && (img.url.startsWith("http") || img.url.startsWith("/")) ? (
                      <Image
                        src={img.url}
                        alt={img.alt ?? product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-500">
                        <span className="text-xs">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="line-clamp-1 font-medium text-neutral-100">
                      {product.name}
                    </div>
                    <div className="text-xs text-neutral-500">/{product.slug}</div>
                  </div>
                </div>
              </TD>
              <TD className="text-neutral-300">{product.brand}</TD>
              <TD className="text-neutral-300">{product.sku}</TD>
              <TD className="text-neutral-300">{product.stock}</TD>
              <TD>
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-xs",
                    product.isActive
                      ? "border border-green-800/40 bg-green-900/20 text-green-300"
                      : "border border-neutral-800 text-neutral-400",
                  )}
                >
                  {product.isActive ? "Ativo" : "Inativo"}
                </span>
              </TD>
              <TD className="font-medium text-neutral-100">
                {CurrencyFormatter.formatBRLFromCents(price.amountCents)}
              </TD>
              <TD>
                <div className="flex justify-end gap-1.5">
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="ghost" size="sm" title="Visualizar">
                      <Eye size={16} />
                      <span className="sr-only">Ver</span>
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="secondary" size="sm" title="Editar">
                      <Pencil size={16} />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    title={product.isActive ? "Desativar" : "Ativar"}
                  >
                    <Power size={16} />
                    <span className="sr-only">
                      {product.isActive ? "Desativar" : "Ativar"}
                    </span>
                  </Button>
                  <Button variant="danger" size="sm" title="Excluir">
                    <Trash2 size={16} />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}
