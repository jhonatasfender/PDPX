export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  position: number;
  createdAt: string;
}

export interface ApiProductPrice {
  id: string;
  productId: string;
  currency: string;
  amountCents: number;
  amount: number;
  validFrom: string;
  validTo: string | null;
  createdAt: string;
}

export interface ApiProductWithDetails {
  product: ApiProduct;
  images: ApiProductImage[];
  price: ApiProductPrice;
}

export interface ApiProductsResponse {
  products: ApiProductWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt" | "price" | "stock";
  sortOrder?: "asc" | "desc";
}

export interface CreateProductRequest {
  slug: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  stock: number;
  price: {
    currency: string;
    amountCents: number;
  };
  images: Array<{
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }>;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  slug?: string;
  name?: string;
  brand?: string;
  sku?: string;
  description?: string;
  stock?: number;
  price?: {
    currency: string;
    amountCents: number;
  };
  images?: Array<{
    id?: string;
    url: string;
    alt?: string | null;
    isPrimary?: boolean;
    position?: number;
  }>;
  isActive?: boolean;
}
