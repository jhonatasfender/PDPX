import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { AuthProvider } from "@/contexts/auth.context";
import HeaderWrapper from "@/components/header-wrapper";

export const metadata: Metadata = {
  title: {
    default: "PDPX - Móveis e Decoração",
    template: "%s | PDPX"
  },
  description: "Descubra nossa coleção exclusiva de móveis e itens de decoração. Qualidade, estilo e conforto para transformar seu espaço.",
  keywords: ["móveis", "decoração", "casa", "interior", "design", "PDPX"],
  authors: [{ name: "PDPX" }],
  creator: "PDPX",
  publisher: "PDPX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pdpx.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://pdpx.com.br",
    title: "PDPX - Móveis e Decoração",
    description: "Descubra nossa coleção exclusiva de móveis e itens de decoração. Qualidade, estilo e conforto para transformar seu espaço.",
    siteName: "PDPX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PDPX - Móveis e Decoração",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDPX - Móveis e Decoração",
    description: "Descubra nossa coleção exclusiva de móveis e itens de decoração. Qualidade, estilo e conforto para transformar seu espaço.",
    images: ["/og-image.jpg"],
    creator: "@pdpx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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
