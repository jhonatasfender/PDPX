import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
  Min,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class ProductImageRequestDto {
  @ApiProperty({ description: "URL da imagem" })
  @IsString()
  url!: string;

  @ApiProperty({ description: "Texto alternativo da imagem", required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return null;
    }
    return value;
  })
  alt?: string | null;

  @ApiProperty({
    description: "Se é a imagem principal",
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiProperty({
    description: "Posição da imagem",
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  position?: number;
}

export class ProductPriceRequestDto {
  @ApiProperty({ description: "Moeda do preço", example: "BRL" })
  @IsString()
  currency!: string;

  @ApiProperty({ description: "Valor em centavos", example: 349900 })
  @IsNumber()
  @Min(0)
  amountCents!: number;
}

export class CreateProductDto {
  @ApiProperty({
    description: "Slug único do produto",
    example: "sofa-modular-linho-cinza",
  })
  @IsString()
  @MinLength(2)
  slug!: string;

  @ApiProperty({
    description: "Nome do produto",
    example: "Sofá Modular Conforto 3 Lugares",
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ description: "Marca do produto", example: "Casa&Conforto" })
  @IsString()
  @MinLength(1)
  brand!: string;

  @ApiProperty({
    description: "SKU único do produto",
    example: "SOFA-3L-MOD-CINZA",
  })
  @IsString()
  @MinLength(1)
  sku!: string;

  @ApiProperty({ description: "Descrição do produto" })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ description: "Quantidade em estoque", example: 12 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({ description: "Preço do produto" })
  @ValidateNested()
  @Type(() => ProductPriceRequestDto)
  price!: ProductPriceRequestDto;

  @ApiProperty({
    description: "Imagens do produto",
    type: [ProductImageRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageRequestDto)
  images!: ProductImageRequestDto[];

  @ApiProperty({
    description: "Se o produto está ativo",
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
