import type { ReactNode } from "react";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import HeaderWrapper from "@/components/header-wrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        suppressHydrationWarning
        className="bg-neutral-950 text-neutral-100"
      >
        <ReactQueryProvider>
          <HeaderWrapper />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
