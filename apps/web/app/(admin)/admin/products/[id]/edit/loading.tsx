import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="space-y-4">
      <nav className="-mb-2" data-cy="admin-edit-nav">
        <Link href="/admin/products" data-cy="admin-edit-back">
          <Button
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Voltar
          </Button>
        </Link>
      </nav>
      <h1 className="text-2xl pt-4 font-semibold tracking-tight">
        Editar produto
      </h1>
      <div className="rounded-lg border border-neutral-800 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="h-10 bg-neutral-800 rounded animate-pulse" />
            <div className="md:col-span-2 h-32 bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-32 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
