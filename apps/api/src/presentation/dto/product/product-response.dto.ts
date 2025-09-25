import { ApiProperty } from "@nestjs/swagger";

export class ProductImageResponseDto {
  @ApiProperty({ description: "ID da imagem" })
  public id!: string;

  @ApiProperty({ description: "ID do produto" })
  public productId!: string;

  @ApiProperty({ description: "URL da imagem" })
  public url!: string;

  @ApiProperty({ description: "Texto alternativo da imagem", nullable: true })
  public alt!: string | null;

  @ApiProperty({ description: "Se é a imagem principal" })
  public isPrimary!: boolean;

  @ApiProperty({ description: "Posição da imagem" })
  public position!: number;

  @ApiProperty({ description: "Data de criação" })
  public createdAt!: Date;
}

export class ProductPriceResponseDto {
  @ApiProperty({ description: "ID do preço" })
  public id!: string;

  @ApiProperty({ description: "ID do produto" })
  public productId!: string;

  @ApiProperty({ description: "Moeda do preço" })
  public currency!: string;

  @ApiProperty({ description: "Valor em centavos" })
  public amountCents!: number;

  @ApiProperty({ description: "Valor em moeda" })
  public amount!: number;

  @ApiProperty({ description: "Data de início da validade" })
  public validFrom!: Date;

  @ApiProperty({ description: "Data de fim da validade", nullable: true })
  public validTo!: Date | null;

  @ApiProperty({ description: "Data de criação" })
  public createdAt!: Date;
}

export class ProductResponseDto {
  @ApiProperty({ description: "ID do produto" })
  public id!: string;

  @ApiProperty({ description: "Slug único do produto" })
  public slug!: string;

  @ApiProperty({ description: "Nome do produto" })
  public name!: string;

  @ApiProperty({ description: "Marca do produto" })
  public brand!: string;

  @ApiProperty({ description: "SKU único do produto" })
  public sku!: string;

  @ApiProperty({ description: "Descrição do produto" })
  public description!: string;

  @ApiProperty({ description: "Quantidade em estoque" })
  public stock!: number;

  @ApiProperty({ description: "Se o produto está ativo" })
  public isActive!: boolean;

  @ApiProperty({ description: "Data de criação" })
  public createdAt!: Date;

  @ApiProperty({ description: "Data de atualização" })
  public updatedAt!: Date;
}

export class ProductWithDetailsResponseDto {
  @ApiProperty({ description: "Dados do produto" })
  public product!: ProductResponseDto;

  @ApiProperty({
    description: "Imagens do produto",
    type: [ProductImageResponseDto],
  })
  public images!: ProductImageResponseDto[];

  @ApiProperty({ description: "Preço atual do produto", nullable: true })
  public price!: ProductPriceResponseDto | null;
}

export class ListProductsResponseDto {
  @ApiProperty({
    description: "Lista de produtos com detalhes",
    type: [ProductWithDetailsResponseDto],
  })
  public products!: ProductWithDetailsResponseDto[];

  @ApiProperty({ description: "Total de produtos" })
  public total!: number;

  @ApiProperty({ description: "Página atual" })
  public page!: number;

  @ApiProperty({ description: "Limite por página" })
  public limit!: number;

  @ApiProperty({ description: "Total de páginas" })
  public totalPages!: number;
}

// Public catalog lightweight image DTO (no productId/createdAt)

export class PublicImageDto {
  @ApiProperty()
  public id!: string;
  @ApiProperty()
  public url!: string;
  @ApiProperty({ nullable: true })
  public alt!: string | null;
  @ApiProperty()
  public isPrimary!: boolean;
  @ApiProperty()
  public position!: number;
}

export class PublicCatalogProductDto {
  @ApiProperty()
  public id!: string;
  @ApiProperty()
  public slug!: string;
  @ApiProperty()
  public name!: string;
  @ApiProperty()
  public brand!: string;
  @ApiProperty()
  public sku!: string;
  @ApiProperty()
  public description!: string;
  @ApiProperty({ type: [PublicImageDto] })
  public images!: PublicImageDto[];
  @ApiProperty({ type: () => Object })
  public price!: { currency: string; amountCents: number };
  @ApiProperty()
  public stock!: number;
  @ApiProperty()
  public isActive!: boolean;
}

export class ListPublicCatalogResponseDto {
  @ApiProperty({ type: [PublicCatalogProductDto] })
  public products!: PublicCatalogProductDto[];
  @ApiProperty()
  public total!: number;
  @ApiProperty()
  public page!: number;
  @ApiProperty()
  public limit!: number;
  @ApiProperty()
  public totalPages!: number;
}

export class PublicFiltersResponseDto {
  @ApiProperty({ type: [String] })
  public brands!: string[];
  @ApiProperty({ type: () => Object })
  public price!: { minCents: number; maxCents: number };
}

export class CreateProductResponseDto {
  @ApiProperty({ description: "Produto criado" })
  public product!: ProductResponseDto;

  @ApiProperty({
    description: "Imagens criadas",
    type: [ProductImageResponseDto],
  })
  public images!: ProductImageResponseDto[];

  @ApiProperty({ description: "Preço criado" })
  public price!: ProductPriceResponseDto;
}

export class UpdateProductResponseDto {
  @ApiProperty({ description: "Produto atualizado" })
  public product!: ProductResponseDto;

  @ApiProperty({
    description: "Imagens atualizadas",
    type: [ProductImageResponseDto],
  })
  public images!: ProductImageResponseDto[];

  @ApiProperty({ description: "Preço atualizado", nullable: true })
  public price!: ProductPriceResponseDto | null;
}

export class DeleteProductResponseDto {
  @ApiProperty({ description: "Se a operação foi bem-sucedida" })
  public success!: boolean;

  @ApiProperty({ description: "Mensagem de resposta" })
  public message!: string;
}
