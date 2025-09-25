export type ProductImageDTO = {
  id: string;
  url: string;
  alt?: string | null;
  isPrimary: boolean;
  position: number;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  isActive: boolean;
  images: ProductImageDTO[];
};

export type PriceDTO = {
  productId: string;
  currency: string;
  amountCents: number;
  validFrom: string;
  validTo?: string | null;
};

export type ProductWithPriceDTO = {
  product: ProductDTO;
  price: PriceDTO;
};

export type PublicCatalogProductDTO = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  images: ProductImageDTO[];
  price: { currency: string; amountCents: number };
  stock: number;
  isActive: boolean;
};

export interface ProductRepository {
  findBySlugWithImages(slug: string): Promise<ProductDTO | null>;
}

export interface PriceRepository {
  getCurrentByProductId(productId: string): Promise<PriceDTO | null>;
}

export type PublicCatalogItemInput = {
  product: ProductDTO;
  images: ProductImageDTO[];
  price?: { currency: string; amountCents: number } | null;
};
