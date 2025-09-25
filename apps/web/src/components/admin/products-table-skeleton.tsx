import { Table, THead, TBody, TR, TH, TD } from "../ui/table";

interface ProductsTableSkeletonProps {
  rows?: number;
}

export function ProductsTableSkeleton({ rows = 5 }: ProductsTableSkeletonProps) {
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
                <div className="h-12 w-16 min-h-[48px] min-w-[64px] flex-shrink-0 rounded-md animate-pulse" style={{ backgroundColor: '#262626' }} />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
                  <div className="h-3 w-20 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
                </div>
              </div>
            </TD>
            <TD>
              <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
            </TD>
            <TD>
              <div className="h-4 w-20 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
            </TD>
            <TD>
              <div className="h-4 w-8 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
            </TD>
            <TD>
              <div className="h-6 w-12 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
            </TD>
            <TD>
              <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
            </TD>
            <TD>
              <div className="flex justify-end gap-1.5">
                <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
                <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
                <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
                <div className="h-8 w-8 rounded animate-pulse" style={{ backgroundColor: '#262626' }} />
              </div>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
