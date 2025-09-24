import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth requireRole="ADMIN">
      {children}
    </AuthGuard>
  );
}
