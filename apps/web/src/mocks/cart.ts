import type { MockProduct } from "./types";
import { mockProducts } from "./catalog";

export type MockCartItem = {
  product: MockProduct;
  quantity: number;
};

export const mockCart: MockCartItem[] = [
  { product: mockProducts[0], quantity: 1 },
  { product: mockProducts[1], quantity: 2 },
];
