import type { MockProduct } from "./types";

export const mockProduct: MockProduct = {
  id: "1",
  slug: "sofa-modular-linho-cinza",
  name: "Sofá Modular Conforto 3 Lugares",
  brand: "Casa&Conforto",
  sku: "SOFA-3L-MOD-CINZA",
  description:
    "Sofá modular em linho cinza, com chaise reversível e espuma de alta densidade. Ideal para salas modernas e espaços integrados.",
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
      url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200",
      alt: "Detalhe do tecido",
      isPrimary: false,
      position: 1,
    },
    {
      id: "i3",
      url: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200",
      alt: "Vista lateral",
      isPrimary: false,
      position: 2,
    },
    {
      id: "i4",
      url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200",
      alt: "Sala ampla com sofá",
      isPrimary: false,
      position: 3,
    },
    {
      id: "i5",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
      alt: "Close no braço do sofá",
      isPrimary: false,
      position: 4,
    },
    {
      id: "i6",
      url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200",
      alt: "Sala com iluminação natural",
      isPrimary: false,
      position: 5,
    },
    {
      id: "i7",
      url: "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?q=80&w=1200",
      alt: "Detalhe das costuras",
      isPrimary: false,
      position: 6,
    },
    {
      id: "i8",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
      alt: "Ambiente integrado sala e jantar",
      isPrimary: false,
      position: 7,
    },
  ],
  price: { currency: "BRL", amountCents: 349900 },
};
