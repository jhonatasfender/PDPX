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

export type CartItemDTO = { sku: string; quantity: number };
export type AddToCartResponseDTO = { success: boolean; message: string };

export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export interface ProductRepository {
  findBySlugWithImages(slug: string): Promise<ProductDTO | null>;
}

export interface PriceRepository {
  getCurrentByProductId(productId: string): Promise<PriceDTO | null>;
}

export interface CartRepository {
  addItem(input: CartItemDTO): Promise<AddToCartResponseDTO>;
}

export const TOKENS = {
  ProductRepository: Symbol("ProductRepository"),
  PriceRepository: Symbol("PriceRepository"),
  CartRepository: Symbol("CartRepository"),
};
