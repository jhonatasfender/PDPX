import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { RequireAdmin } from "../../decorators/roles.decorator";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { User } from "../../../domain/entities/user.entity";
import { ProductMapper } from "../../mappers/product.mapper";
import { CreateProductDto } from "../../dto/product/create-product.dto";
import { UpdateProductDto } from "../../dto/product/update-product.dto";
import {
  CreateProductResponseDto,
  UpdateProductResponseDto,
  DeleteProductResponseDto,
  ProductWithDetailsResponseDto,
  ListProductsResponseDto,
} from "../../dto/product/product-response.dto";
import { CreateProductUseCase } from "../../../application/product/use-cases/create-product.use-case";
import { GetProductUseCase } from "../../../application/product/use-cases/get-product.use-case";
import { ListProductsUseCase } from "../../../application/product/use-cases/list-products.use-case";
import { UpdateProductUseCase } from "../../../application/product/use-cases/update-product.use-case";
import { DeleteProductUseCase } from "../../../application/product/use-cases/delete-product.use-case";

@ApiTags("Administração - Produtos")
@Controller("admin/products")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth("JWT-auth")
export class AdminProductController {
  public constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @RequireAdmin()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Criar produto",
    description: "Cria um novo produto (requer role ADMIN ou SUPERADMIN)",
  })
  @ApiResponse({
    status: 201,
    description: "Produto criado com sucesso",
    type: CreateProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado - permissões insuficientes",
  })
  public async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: User,
  ): Promise<CreateProductResponseDto> {
    const request = ProductMapper.toCreateProductRequest(createProductDto);
    const response = await this.createProductUseCase.execute(request);
    return ProductMapper.toCreateProductResponse(response);
  }

  @Get()
  @RequireAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Listar produtos",
    description: "Lista todos os produtos com paginação e filtros (requer role ADMIN ou SUPERADMIN)",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Número da página" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Limite por página" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Termo de busca" })
  @ApiQuery({ name: "brand", required: false, type: String, description: "Filtrar por marca" })
  @ApiQuery({ name: "isActive", required: false, type: Boolean, description: "Filtrar por status" })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos obtida com sucesso",
    type: ListProductsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado - permissões insuficientes",
  })
  public async listProducts(
    @CurrentUser() user: User,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("brand") brand?: string,
    @Query("isActive") isActive?: boolean,
  ): Promise<ListProductsResponseDto> {
    const request = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      brand,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
    };
    
    const response = await this.listProductsUseCase.execute(request);
    return ProductMapper.toListProductsResponse(response);
  }

  @Get(":id")
  @RequireAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Obter produto por ID",
    description: "Obtém um produto específico por ID (requer role ADMIN ou SUPERADMIN)",
  })
  @ApiResponse({
    status: 200,
    description: "Produto obtido com sucesso",
    type: ProductWithDetailsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Produto não encontrado",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado - permissões insuficientes",
  })
  public async getProduct(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<ProductWithDetailsResponseDto> {
    const request = { id };
    const response = await this.getProductUseCase.execute(request);
    return ProductMapper.toGetProductResponse(response);
  }

  @Put(":id")
  @RequireAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Atualizar produto",
    description: "Atualiza um produto existente (requer role ADMIN ou SUPERADMIN)",
  })
  @ApiResponse({
    status: 200,
    description: "Produto atualizado com sucesso",
    type: UpdateProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Produto não encontrado",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado - permissões insuficientes",
  })
  public async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: User,
  ): Promise<UpdateProductResponseDto> {
    const request = ProductMapper.toUpdateProductRequest(id, updateProductDto);
    const response = await this.updateProductUseCase.execute(request);
    return ProductMapper.toUpdateProductResponse(response);
  }

  @Delete(":id")
  @RequireAdmin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Deletar produto",
    description: "Deleta um produto (requer role ADMIN ou SUPERADMIN)",
  })
  @ApiResponse({
    status: 200,
    description: "Produto deletado com sucesso",
    type: DeleteProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Produto não encontrado",
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado - permissões insuficientes",
  })
  public async deleteProduct(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<DeleteProductResponseDto> {
    const request = { id };
    const response = await this.deleteProductUseCase.execute(request);
    return ProductMapper.toDeleteProductResponse(response);
  }
}
