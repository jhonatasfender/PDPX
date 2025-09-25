import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ListProductsUseCase } from "../../../application/product/use-cases/list-products.use-case";
import { ProductPublicMapper } from "../../mappers/product-public.mapper";
import { ProductFiltersMapper } from "../../mappers/product-filters.mapper";
import {
  ListPublicCatalogResponseDto,
  PublicFiltersResponseDto,
} from "../../dto/product/product-response.dto";

@Controller("public")
export class CatalogPublicController {
  public constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
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
}
