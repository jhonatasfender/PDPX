import { ApiProperty } from "@nestjs/swagger";

export class ProductImageResponseDto {
  @ApiProperty({ description: "ID da imagem" })
  id!: string;

  @ApiProperty({ description: "ID do produto" })
  productId!: string;

  @ApiProperty({ description: "URL da imagem" })
  url!: string;

  @ApiProperty({ description: "Texto alternativo da imagem", nullable: true })
  alt!: string | null;

  @ApiProperty({ description: "Se é a imagem principal" })
  isPrimary!: boolean;

  @ApiProperty({ description: "Posição da imagem" })
  position!: number;

  @ApiProperty({ description: "Data de criação" })
  createdAt!: Date;
}

export class ProductPriceResponseDto {
  @ApiProperty({ description: "ID do preço" })
  id!: string;

  @ApiProperty({ description: "ID do produto" })
  productId!: string;

  @ApiProperty({ description: "Moeda do preço" })
  currency!: string;

  @ApiProperty({ description: "Valor em centavos" })
  amountCents!: number;

  @ApiProperty({ description: "Valor em moeda" })
  amount!: number;

  @ApiProperty({ description: "Data de início da validade" })
  validFrom!: Date;

  @ApiProperty({ description: "Data de fim da validade", nullable: true })
  validTo!: Date | null;

  @ApiProperty({ description: "Data de criação" })
  createdAt!: Date;
}

export class ProductResponseDto {
  @ApiProperty({ description: "ID do produto" })
  id!: string;

  @ApiProperty({ description: "Slug único do produto" })
  slug!: string;

  @ApiProperty({ description: "Nome do produto" })
  name!: string;

  @ApiProperty({ description: "Marca do produto" })
  brand!: string;

  @ApiProperty({ description: "SKU único do produto" })
  sku!: string;

  @ApiProperty({ description: "Descrição do produto" })
  description!: string;

  @ApiProperty({ description: "Quantidade em estoque" })
  stock!: number;

  @ApiProperty({ description: "Se o produto está ativo" })
  isActive!: boolean;

  @ApiProperty({ description: "Data de criação" })
  createdAt!: Date;

  @ApiProperty({ description: "Data de atualização" })
  updatedAt!: Date;
}

export class ProductWithDetailsResponseDto {
  @ApiProperty({ description: "Dados do produto" })
  product!: ProductResponseDto;

  @ApiProperty({ description: "Imagens do produto", type: [ProductImageResponseDto] })
  images!: ProductImageResponseDto[];

  @ApiProperty({ description: "Preço atual do produto", nullable: true })
  price!: ProductPriceResponseDto | null;
}

export class ListProductsResponseDto {
  @ApiProperty({ description: "Lista de produtos com detalhes", type: [ProductWithDetailsResponseDto] })
  products!: ProductWithDetailsResponseDto[];

  @ApiProperty({ description: "Total de produtos" })
  total!: number;

  @ApiProperty({ description: "Página atual" })
  page!: number;

  @ApiProperty({ description: "Limite por página" })
  limit!: number;

  @ApiProperty({ description: "Total de páginas" })
  totalPages!: number;
}

export class CreateProductResponseDto {
  @ApiProperty({ description: "Produto criado" })
  product!: ProductResponseDto;

  @ApiProperty({ description: "Imagens criadas", type: [ProductImageResponseDto] })
  images!: ProductImageResponseDto[];

  @ApiProperty({ description: "Preço criado" })
  price!: ProductPriceResponseDto;
}

export class UpdateProductResponseDto {
  @ApiProperty({ description: "Produto atualizado" })
  product!: ProductResponseDto;

  @ApiProperty({ description: "Imagens atualizadas", type: [ProductImageResponseDto] })
  images!: ProductImageResponseDto[];

  @ApiProperty({ description: "Preço atualizado", nullable: true })
  price!: ProductPriceResponseDto | null;
}

export class DeleteProductResponseDto {
  @ApiProperty({ description: "Se a operação foi bem-sucedida" })
  success!: boolean;

  @ApiProperty({ description: "Mensagem de resposta" })
  message!: string;
}