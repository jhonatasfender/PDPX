import type { ReactNode } from "react";
import "./globals.css";
import { ReactQueryProvider } from "../src/providers/react-query-provider";
import Header from "../src/components/header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        suppressHydrationWarning
        className="bg-neutral-950 text-neutral-100"
      >
        <ReactQueryProvider>
          <Header />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
