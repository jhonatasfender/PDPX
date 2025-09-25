import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { ListProductsUseCase } from "../../../application/product/use-cases/list-products.use-case";
import { GetProductUseCase } from "../../../application/product/use-cases/get-product.use-case";
import { ProductPublicMapper } from "../../mappers/product-public.mapper";
import { ProductFiltersMapper } from "../../mappers/product-filters.mapper";
import {
  ListPublicCatalogResponseDto,
  PublicFiltersResponseDto,
  PublicCatalogProductDto,
} from "../../dto/product/product-response.dto";

@Controller("public")
export class CatalogPublicController {
  public constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  @Get("products")
  @HttpCode(HttpStatus.OK)
  public async listPublicProducts(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("brand") brand?: string,
  ): Promise<ListPublicCatalogResponseDto> {
    const request = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      brand,
      isActive: true,
    };

    const response = await this.listProductsUseCase.execute(request);
    return {
      products: response.products.map((item) =>
        ProductPublicMapper.toPublicCatalog(item),
      ),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    };
  }

  @Get("filters")
  @HttpCode(HttpStatus.OK)
  public async getPublicFilters(): Promise<PublicFiltersResponseDto> {
    const resp = await this.listProductsUseCase.execute({
      page: 1,
      limit: 1000,
      isActive: true,
    });
    return ProductFiltersMapper.toPublicFilters(resp);
  }

  @Get("products/:slug")
  @HttpCode(HttpStatus.OK)
  public async getPublicProductBySlug(
    @Param("slug") slug: string,
  ): Promise<PublicCatalogProductDto> {
    try {
      const result = await this.getProductUseCase.execute({ slug });
      return ProductPublicMapper.toPublicCatalog({
        product: result.product,
        images: result.images,
        price: result.price
          ? {
              currency: result.price.currency,
              amountCents: result.price.amountCents,
            }
          : null,
      });
    } catch (error) {
      throw new NotFoundException("Produto não encontrado");
    }
  }
}
