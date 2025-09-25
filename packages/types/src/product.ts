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

export function mapToPublicCatalogProduct(
  item: PublicCatalogItemInput,
): PublicCatalogProductDTO {
  return {
    id: item.product.id,
    slug: item.product.slug,
    name: item.product.name,
    brand: item.product.brand,
    sku: item.product.sku,
    description: item.product.description,
    images: item.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? null,
      isPrimary: img.isPrimary,
      position: img.position,
    })),
    price: item.price
      ? { currency: item.price.currency, amountCents: item.price.amountCents }
      : { currency: "BRL", amountCents: 0 },
    // Stock may not be present on ProductDTO in some contexts; default to 0 if missing
    stock: (item.product as any).stock ?? 0,
    isActive: item.product.isActive,
  };
}
