export type MockProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  position: number;
};

export type MockPrice = {
  currency: "BRL";
  amountCents: number;
};

export type MockProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  images: MockProductImage[];
  price: MockPrice;
};
