import { ImageResponse } from "next/og";

export const runtime = "edge";
const OG_SIZE = { width: 1200, height: 630 };

function formatBRL(cents?: number): string {
  if (typeof cents !== "number") return "";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `R$ ${(cents / 100).toFixed(2)}`;
  }
}

type ProductResp = {
  name: string;
  brand: string;
  slug: string;
  price?: { amountCents: number };
};

export async function GET(
  _req: Request,
  ctx: any,
) {
  const slug = typeof ctx?.params?.slug === "string" ? ctx.params.slug : "";
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  let product: ProductResp | null = null;
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/public/products/${slug}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        product = (await res.json()) as ProductResp;
      }
    } catch {
      // ignore, render generic image
    }
  }

  const titleBase = product ? `${product.name} — ${product.brand}` : "PDPX";
  const title =
    titleBase.length > 42
      ? `${titleBase.slice(0, 39).trimEnd()}...`
      : titleBase;
  const price = formatBRL(product?.price?.amountCents);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          background: "linear-gradient(135deg,#0a0a0a,#111827)",
          color: "#f9fafb",
          fontFamily: "Inter, ui-sans-serif, system-ui",
        }}
      >
        <div style={{ fontSize: 28, color: "#9ca3af" }}>PDPX</div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
              {title}
            </div>
            {price ? (
              <div style={{ marginTop: 12, fontSize: 28, color: "#a7f3d0" }}>
                {price}
              </div>
            ) : null}
          </div>
          <div
            style={{
              width: 320,
              height: 180,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(59,130,246,.2), rgba(16,185,129,.2))",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          />
        </div>
        <div style={{ fontSize: 20, color: "#9ca3af" }}>
          Entrega rápida • 1 ano de garantia • Troca em 30 dias
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
