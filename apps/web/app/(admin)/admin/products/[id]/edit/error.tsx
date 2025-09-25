"use client";

import Link from "next/link";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
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
      <div className="rounded-lg border border-red-800/40 bg-red-900/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-red-300">
              Erro ao carregar produto
            </h2>
            <p className="text-sm text-red-400 mt-1">
              {error.message || "Ocorreu um erro inesperado ao carregar os dados do produto."}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={reset}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
