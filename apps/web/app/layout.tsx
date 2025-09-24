import type { ReactNode } from "react";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { AuthProvider } from "@/contexts/auth.context";
import HeaderWrapper from "@/components/header-wrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        suppressHydrationWarning
        className="bg-neutral-950 text-neutral-100"
      >
        <ReactQueryProvider>
          <AuthProvider>
            <HeaderWrapper />
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
