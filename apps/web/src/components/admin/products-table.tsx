"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import { useProducts } from "../../hooks/use-products";
import type {
  ApiProductWithDetails,
} from "../../types/product";
import { CurrencyFormatter } from "../../lib/format";
import { Button } from "../ui/button";
import { Table, THead, TBody, TR, TH, TD } from "../ui/table";
import { ConfirmationModal } from "../ui/confirmation-modal";
import { Eye, Pencil, Trash2, ImageOff, Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProductsTableWithPaginationSkeleton } from "./products-table-skeleton";

export function ProductsTable() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    products,
    total,
    totalPages,
    currentPage,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    deleteProduct,
    toggleProductStatus,
    isDeleting,
    isToggling,
  } = useProducts({ page, limit });

  const handleDeleteClick = (product: ApiProductWithDetails) => {
    setProductToDelete({
      id: product.product.id,
      name: product.product.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
  };

  const handleToggleStatus = async (product: ApiProductWithDetails) => {
      await toggleProductStatus(product.product.id);
  };


  if (isLoading) {
    return <ProductsTableWithPaginationSkeleton rows={limit} />;
  }

  if (isError) {
    return (
      <div
        className="rounded-lg border border-red-800/40 bg-red-900/20 p-4"
        data-cy="admin-products-error"
      >
        <p className="text-red-300" data-cy="admin-products-error-message">
          Erro: {(error as any)?.message ?? "Falha ao carregar"}
        </p>
        <button
          className="mt-2"
          data-cy="admin-products-retry"
          onClick={() => refetch()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="rounded-lg border border-neutral-800 p-8 text-center"
        data-cy="admin-products-empty"
      >
        <p className="text-neutral-400">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <Table data-cy="admin-products-table">
        <THead>
          <TR>
            <TH data-cy="th-produto">Produto</TH>
            <TH data-cy="th-marca">Marca</TH>
            <TH data-cy="th-sku">SKU</TH>
            <TH data-cy="th-estoque">Estoque</TH>
            <TH data-cy="th-status">Status</TH>
            <TH data-cy="th-preco">Preço</TH>
            <TH className="text-right" data-cy="th-acoes">
              Ações
            </TH>
          </TR>
        </THead>
        <TBody>
          {products.map((productData: ApiProductWithDetails) => {
            const { product, images, price } = productData;
            const img = Array.isArray(images)
              ? images.find((i) => i && i.url && i.url !== "string")
              : undefined;
            return (
              <TR key={product.id} data-cy={`admin-product-row-${product.id}`}>
                <TD data-cy="col-produto">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 min-h-[48px] min-w-[64px] flex-shrink-0 overflow-hidden rounded-md bg-neutral-800">
                      {img &&
                      img.url &&
                      (img.url.startsWith("http") ||
                        img.url.startsWith("/")) ? (
                        <Image
                          src={img.url}
                          alt={img.alt ?? product.name}
                          fill
                          sizes="(max-width: 768px) 64px, 64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-600">
                          <ImageOff size={18} aria-hidden="true" />
                          <span className="sr-only">Sem imagem</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="line-clamp-1 font-medium text-neutral-100">
                        {product.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        /{product.slug}
                      </div>
                    </div>
                  </div>
                </TD>
                <TD className="text-neutral-300" data-cy="col-marca">
                  {product.brand}
                </TD>
                <TD className="text-neutral-300" data-cy="col-sku">
                  {product.sku}
                </TD>
                <TD className="text-neutral-300" data-cy="col-estoque">
                  {product.stock}
                </TD>
                <TD data-cy="col-status">
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
                <TD
                  className="font-medium text-neutral-100"
                  data-cy="col-preco"
                >
                  {CurrencyFormatter.formatBRLFromCents(price.amountCents)}
                </TD>
                <TD data-cy="col-acoes">
                  <div className="flex justify-end gap-1.5" data-cy="acoes">
                    <Link
                      href={`/admin/products/${product.id}`}
                      data-cy="btn-ver"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Visualizar"
                        data-cy="action-ver"
                      >
                        <Eye size={16} />
                        <span className="sr-only">Ver</span>
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      data-cy="btn-editar"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        title="Editar"
                        data-cy="action-editar"
                      >
                        <Pencil size={16} />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      title={product.isActive ? "Desativar" : "Ativar"}
                      data-cy="action-toggle-status"
                      onClick={() => handleToggleStatus(productData)}
                      disabled={isToggling}
                    >
                      {product.isActive ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                      <span className="sr-only">
                        {product.isActive ? "Desativar" : "Ativar"}
                      </span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      title="Excluir"
                      data-cy="action-excluir"
                      onClick={() => handleDeleteClick(productData)}
                    >
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
      
      {isFetching && (
        <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
          <div className="relative z-10">
            <ProductsTableWithPaginationSkeleton rows={limit} showPagination={false} />
          </div>
        </div>
      )}
      </div>

      <div
        className="mt-4 flex items-center justify-between"
        data-cy="admin-products-pagination"
      >
        <div
          className="flex items-center gap-2 text-sm text-neutral-400"
          data-cy="admin-products-page-info"
        >
          <span>
            Página {currentPage} de {totalPages} • {total} itens
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            data-cy="admin-products-prev"
          >
            Anterior
          </button>
          <button
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            data-cy="admin-products-next"
          >
            Próxima
          </button>
          <select
            className="ml-2 rounded-md border border-neutral-800 bg-neutral-900 p-1 text-sm text-neutral-100"
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value) || 10;
              setLimit(newLimit);
              setPage(1);
            }}
            data-cy="admin-products-page-size"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}/página
              </option>
            ))}
          </select>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o produto "${productToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
