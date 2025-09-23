import type { MockProduct } from "./types";

const baseProducts: MockProduct[] = [
  {
    id: "1",
    slug: "sofa-modular-linho-cinza",
    name: "Sofá Modular Conforto 3 Lugares",
    brand: "Casa&Conforto",
    sku: "SOFA-3L-MOD-CINZA",
    description:
      "Sofá modular em linho cinza, com chaise reversível e espuma de alta densidade.",
    images: [
      {
        id: "i1",
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200",
        alt: "Sofá ângulo frontal",
        isPrimary: true,
        position: 0,
      },
      {
        id: "i2",
        url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200",
        alt: "Sala ampla",
        isPrimary: false,
        position: 1,
      },
      {
        id: "i3",
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200",
        alt: "Detalhe tecido",
        isPrimary: false,
        position: 2,
      },
    ],
    price: { currency: "BRL", amountCents: 349900 },
  },
  {
    id: "2",
    slug: "poltrona-veludo-azul",
    name: "Poltrona Requinte em Veludo",
    brand: "StudioLounge",
    sku: "POL-REQ-VEL-AZUL",
    description:
      "Poltrona em veludo azul, design moderno e acabamento premium.",
    images: [
      {
        id: "i1",
        url: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1200",
        alt: "Poltrona em veludo azul",
        isPrimary: true,
        position: 0,
      },
      {
        id: "i2",
        url: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1200",
        alt: "Ambiente poltrona",
        isPrimary: false,
        position: 1,
      },
      {
        id: "i3",
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200",
        alt: "Detalhe tecido poltrona",
        isPrimary: false,
        position: 2,
      },
    ],
    price: { currency: "BRL", amountCents: 189900 },
  },
  {
    id: "3",
    slug: "mesa-jantar-madeira-macica",
    name: "Mesa de Jantar Madeira Maciça 6 Lugares",
    brand: "NaturaCasa",
    sku: "MESA-JANT-6-MAD",
    description:
      "Mesa robusta em madeira maciça, perfeita para reunir a família.",
    images: [
      {
        id: "i1",
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200",
        alt: "Mesa de jantar madeira",
        isPrimary: true,
        position: 0,
      },
      {
        id: "i2",
        url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200",
        alt: "Ambiente sala jantar",
        isPrimary: false,
        position: 1,
      },
      {
        id: "i3",
        url: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200",
        alt: "Detalhe tampo",
        isPrimary: false,
        position: 2,
      },
    ],
    price: { currency: "BRL", amountCents: 259900 },
  },
];

const brands = ["Casa&Conforto", "StudioLounge", "NaturaCasa"] as const;
const imageSet = [
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200",
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200",
];

const extraProducts: MockProduct[] = Array.from({ length: 300 }, (_, idx) => {
  const n = idx + 4;
  const brand = brands[n % brands.length];
  return {
    id: String(n),
    slug: `mock-produto-${n}`,
    name: `Móvel de Exemplo ${n}`,
    brand,
    sku: `MOCK-${n.toString().padStart(4, "0")}`,
    description: "Item mock para testes de lista, filtros e carrossel.",
    images: imageSet.map((url, p) => ({
      id: `i${p + 1}`,
      url,
      alt: `Imagem ${p + 1} do produto ${n}`,
      isPrimary: p === 0,
      position: p,
    })),
    price: { currency: "BRL", amountCents: 120000 + idx * 1375 },
  };
});

export const mockProducts: MockProduct[] = [...baseProducts, ...extraProducts];
