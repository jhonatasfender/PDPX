"use client";

import { createContext, useContext, ReactNode } from "react";
import { useBag } from "@/hooks/use-bag";
import type { BagContextType } from "@/types/bag";

const BagContext = createContext<BagContextType | undefined>(undefined);

export function BagProvider({ children }: { children: ReactNode }) {
  const bagData = useBag();

  return <BagContext.Provider value={bagData}>{children}</BagContext.Provider>;
}

export function useBagContext() {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error("useBagContext must be used within a BagProvider");
  }
  return context;
}
