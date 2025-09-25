import { Table, THead, TBody, TR, TH, TD } from "../ui/table";

interface ProductsTableSkeletonProps {
  rows?: number;
}

interface ProductsPaginationSkeletonProps {
  showPagination?: boolean;
}

export function ProductsTableSkeleton({
  rows = 5,
}: ProductsTableSkeletonProps) {
  return (
    <Table data-cy="admin-products-table-skeleton">
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
        {Array.from({ length: rows }).map((_, index) => (
          <TR key={index}>
            <TD>
              <div className="flex items-center gap-3">
                <div className="h-12 w-16 min-h-[48px] min-w-[64px] flex-shrink-0 rounded-md bg-neutral-800 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-neutral-800 animate-pulse" />
                </div>
              </div>
            </TD>
            <TD>
              <div className="h-4 w-16 rounded bg-neutral-800 animate-pulse" />
            </TD>
            <TD>
              <div className="h-4 w-20 rounded bg-neutral-800 animate-pulse" />
            </TD>
            <TD>
              <div className="h-4 w-8 rounded bg-neutral-800 animate-pulse" />
            </TD>
            <TD>
              <div className="h-6 w-12 rounded bg-neutral-800 animate-pulse" />
            </TD>
            <TD>
              <div className="h-4 w-16 rounded bg-neutral-800 animate-pulse" />
            </TD>
            <TD>
              <div className="flex justify-end gap-1.5">
                <div className="h-8 w-8 rounded bg-neutral-800 animate-pulse" />
                <div className="h-8 w-8 rounded bg-neutral-800 animate-pulse" />
                <div className="h-8 w-8 rounded bg-neutral-800 animate-pulse" />
                <div className="h-8 w-8 rounded bg-neutral-800 animate-pulse" />
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}

export function ProductsPaginationSkeleton() {
  return (
    <div
      className="mt-4 flex items-center justify-between"
      data-cy="admin-products-pagination-skeleton"
    >
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-neutral-800 rounded animate-pulse" />
        <div className="h-8 w-20 bg-neutral-800 rounded animate-pulse" />
        <div className="h-8 w-24 bg-neutral-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ProductsTableWithPaginationSkeleton({
  rows = 5,
  showPagination = true,
}: ProductsTableSkeletonProps & ProductsPaginationSkeletonProps) {
  return (
    <>
      <ProductsTableSkeleton rows={rows} />
      {showPagination && <ProductsPaginationSkeleton />}
    </>
  );
}
