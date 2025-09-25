export * from "./product";

export type CartItemDTO = { sku: string; quantity: number };
export type AddToCartResponseDTO = { success: boolean; message: string };

export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export * from "./product";

export interface CartRepository {
  addItem(input: CartItemDTO): Promise<AddToCartResponseDTO>;
}

export const TOKENS = {
  ProductRepository: Symbol("ProductRepository"),
  PriceRepository: Symbol("PriceRepository"),
  CartRepository: Symbol("CartRepository"),
};

export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";
export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;
