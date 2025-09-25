import type { ReactNode } from "react";
import { Suspense } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
