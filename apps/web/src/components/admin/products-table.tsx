import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "../../mocks/catalog";
import { CurrencyFormatter } from "../../lib/format";
import { Button } from "../ui/button";
import { Table, THead, TBody, TR, TH, TD } from "../ui/table";
import { Eye, Pencil, Power, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function ProductsTable() {
  const rows = mockProducts.slice(0, 25);
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
        {rows.map((p) => {
          const img = p.images[0];
          return (
            <TR key={p.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded-md bg-neutral-800">
                    {img && (
                      <Image
                        src={img.url}
                        alt={img.alt ?? p.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="line-clamp-1 font-medium text-neutral-100">
                      {p.name}
                    </div>
                    <div className="text-xs text-neutral-500">/{p.slug}</div>
                  </div>
                </div>
              </TD>
              <TD className="text-neutral-300">{p.brand}</TD>
              <TD className="text-neutral-300">{p.sku}</TD>
              <TD className="text-neutral-300">{p.stock}</TD>
              <TD>
                <span
                  className={cn(
                    "rounded-md px-2 py-1 text-xs",
                    p.isActive
                      ? "border border-green-800/40 bg-green-900/20 text-green-300"
                      : "border border-neutral-800 text-neutral-400",
                  )}
                >
                  {p.isActive ? "Ativo" : "Inativo"}
                </span>
              </TD>
              <TD className="font-medium text-neutral-100">
                {CurrencyFormatter.formatBRLFromCents(p.price.amountCents)}
              </TD>
              <TD>
                <div className="flex justify-end gap-1.5">
                  <Link href={`/admin/products/${p.id}`}>
                    <Button variant="ghost" size="sm" title="Visualizar">
                      <Eye size={16} />
                      <span className="sr-only">Ver</span>
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${p.id}/edit`}>
                    <Button variant="secondary" size="sm" title="Editar">
                      <Pencil size={16} />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    title={p.isActive ? "Desativar" : "Ativar"}
                  >
                    <Power size={16} />
                    <span className="sr-only">
                      {p.isActive ? "Desativar" : "Ativar"}
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
