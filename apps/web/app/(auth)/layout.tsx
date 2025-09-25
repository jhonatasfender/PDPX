import type { ReactNode } from "react";
import { Suspense } from "react";
import { AuthGuard } from "@/components/auth-guard";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AuthGuard requireAuth>{children}</AuthGuard>
    </Suspense>
  );
}
