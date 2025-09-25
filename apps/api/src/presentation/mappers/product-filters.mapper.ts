import { PublicFiltersResponseDto } from "../dto/product/product-response.dto";

type ProductListItem = {
  product: { brand?: string };
  price?: { amountCents: number } | null;
};
type SimpleListProductsResponse = {
  products: ProductListItem[];
};

export class ProductFiltersMapper {
  public static toPublicFilters(
    resp: SimpleListProductsResponse,
  ): PublicFiltersResponseDto {
    const brands = resp.products
      .map((p: ProductListItem) => p.product.brand)
      .filter((b: unknown): b is string => typeof b === "string" && Boolean(b))
      .filter((b: string, i: number, arr: string[]) => arr.indexOf(b) === i)
      .sort();

    const prices = resp.products
      .map((p: ProductListItem) => p.price?.amountCents)
      .filter(
        (c: unknown): c is number =>
          typeof c === "number" && Number.isFinite(c),
      );

    const minCents = prices.length ? Math.min(...prices) : 0;
    const maxCents = prices.length ? Math.max(...prices) : 0;

    return { brands, price: { minCents, maxCents } };
  }
}
