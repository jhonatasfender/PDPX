import { BagItem } from "../../../domain/entities/bag-item.entity";

export interface BagItemRepository {
  findById(id: string): Promise<BagItem | null>;
  findByBagId(bagId: string): Promise<BagItem[]>;
  findByBagIdAndProductId(bagId: string, productId: string): Promise<BagItem | null>;
  create(data: {
    id: string;
    bagId: string;
    productId: string;
    quantity: number;
    priceCents: number;
  }): Promise<BagItem>;
  updateQuantity(id: string, quantity: number): Promise<BagItem>;
  delete(id: string): Promise<void>;
  deleteByBagId(bagId: string): Promise<void>;
}
