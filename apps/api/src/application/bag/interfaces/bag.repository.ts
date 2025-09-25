import { Bag } from "../../../domain/entities/bag.entity";
import { BagStatus } from "@prisma/client";

export interface BagRepository {
  findById(id: string): Promise<Bag | null>;
  findByUserId(userId: string): Promise<Bag[]>;
  findActiveByUserId(userId: string): Promise<Bag | null>;
  create(data: {
    id: string;
    userId: string;
    status?: BagStatus;
    expiresAt?: Date | null;
  }): Promise<Bag>;
  updateStatus(id: string, status: BagStatus): Promise<Bag>;
  updateExpiresAt(id: string, expiresAt: Date | null): Promise<Bag>;
  delete(id: string): Promise<void>;
  findExpiredBags(): Promise<Bag[]>;
}
