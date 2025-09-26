import { api } from "@/lib/http";

export type OrderDTO = {
  id: string;
  createdAt: string;
  status: string;
  items?: Array<{
    product: {
      id: string;
      name: string;
      slug: string;
      images: Array<{ id: string; url: string; alt?: string | null }>;
    };
    quantity: number;
    priceCents: number;
  }>;
};

export class OrdersService {
  public async list(): Promise<{ orders: OrderDTO[] }> {
    const { data } = await api.get<{ orders: OrderDTO[] }>("/orders");
    return data;
  }
}

export const ordersService = new OrdersService();
