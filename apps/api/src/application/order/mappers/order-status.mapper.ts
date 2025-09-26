import { BagStatus } from "@prisma/client";

export class OrderStatusMapper {
  public static toHuman(status: BagStatus | string): string {
    const value = String(status).toUpperCase() as
      | keyof typeof BagStatus
      | string;
    switch (value) {
      case "CONVERTED":
        return "Pedido realizado";
      case "ACTIVE":
        return "Em aberto";
      case "ABANDONED":
        return "Abandonado";
      case "EXPIRED":
        return "Expirado";
      default:
        return String(status);
    }
  }
}
