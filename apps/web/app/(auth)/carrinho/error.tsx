"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-100">Carrinho</h1>
      </div>
      <div className="rounded-lg border border-red-800/40 bg-red-900/20 p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold text-red-300">
          Algo deu errado!
        </h2>
        <p className="mb-4 text-red-300">
          {error.message || "Falha ao carregar carrinho"}
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
