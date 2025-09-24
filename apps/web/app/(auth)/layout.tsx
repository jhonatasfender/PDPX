import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth-guard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth>
      {children}
    </AuthGuard>
  );
}
