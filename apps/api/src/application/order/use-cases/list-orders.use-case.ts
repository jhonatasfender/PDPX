import { Inject, Injectable } from "@nestjs/common";
import { BagStatus } from "@prisma/client";
import { BagRepository } from "../../bag/interfaces/bag.repository";
import { BagItemRepository } from "../../bag/interfaces/bag-item.repository";
import { GetProductUseCase } from "../../product/use-cases/get-product.use-case";
import { OrderStatusMapper } from "../mappers/order-status.mapper";

export interface ListOrdersRequest {
  userId: string;
}

export interface OrderItemOutput {
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ id: string; url: string; alt?: string | null }>;
  };
  quantity: number;
  priceCents: number;
}

export interface OrderOutput {
  id: string;
  createdAt: Date;
  status: string;
  items: OrderItemOutput[];
}

export interface ListOrdersResponse {
  orders: OrderOutput[];
}

@Injectable()
export class ListOrdersUseCase {
  public constructor(
    @Inject("BagRepository") private readonly bagRepository: BagRepository,
    @Inject("BagItemRepository")
    private readonly bagItemRepository: BagItemRepository,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  public async execute(
    request: ListOrdersRequest,
  ): Promise<ListOrdersResponse> {
    const bags = await this.bagRepository.findConvertedByUserId(request.userId);

    const orders: OrderOutput[] = [];
    for (const bag of bags) {
      const items = await this.bagItemRepository.findByBagId(bag.id);
      const detailed: OrderItemOutput[] = [];

      for (const it of items) {
        try {
          const res = await this.getProductUseCase.execute({
            id: it.productId,
          });
          detailed.push({
            product: {
              id: res.product.id,
              name: res.product.name,
              slug: res.product.slug,
              images: res.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt ?? null,
              })),
            },
            quantity: it.quantity,
            priceCents: (it as any).priceCents ?? 0,
          });
        } catch {
          detailed.push({
            product: {
              id: it.productId,
              name: "Produto",
              slug: "",
              images: [],
            },
            quantity: it.quantity,
            priceCents: (it as any).priceCents ?? 0,
          });
        }
      }

      orders.push({
        id: bag.id,
        createdAt: bag.createdAt,
        status: OrderStatusMapper.toHuman(bag.status as unknown as BagStatus),
        items: detailed,
      });
    }

    return { orders };
  }
}
