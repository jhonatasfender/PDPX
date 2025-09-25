"use client";
import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";

export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      {children}
    </AuthGuard>
  );
}
