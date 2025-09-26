export interface BagItem {
  id: string;
  bagId: string;
  productId: string;
  quantity: number;
  priceCents: number;
  price: number;
  totalPriceCents: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bag {
  id: string;
  userId: string;
  status: "ACTIVE" | "ABANDONED" | "CONVERTED" | "EXPIRED";
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
}

export interface GetBagResponse {
  bag: Bag | null;
  bagItems: BagItem[];
  totalItems: number;
  totalPriceCents: number;
  totalPrice: number;
}

export interface AddItemToBagRequest {
  productId: string;
  quantity: number;
}

export interface AddItemToBagResponse {
  bag: Bag;
  bagItem: BagItem;
}

export interface UpdateItemQuantityRequest {
  productId: string;
  quantity: number;
}

export interface UpdateItemQuantityResponse {
  bagItem: BagItem | null;
  success: boolean;
  message: string;
}

export interface RemoveItemFromBagRequest {
  productId: string;
}

export interface RemoveItemFromBagResponse {
  success: boolean;
  message: string;
}

export interface ClearBagResponse {
  success: boolean;
  message: string;
}

export interface BagContextType {
  bag: Bag | null;
  bagItems: BagItem[];
  bagProductsMap: {
    [productId: string]: import("@pdpx/types").PublicCatalogProductDTO | null;
  };
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isError: boolean;
  error: any;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearBag: () => Promise<void>;
  checkout: () => Promise<void>;
  refetch: () => void;
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  isClearing: boolean;
  isCheckingOut: boolean;
}
