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
import { Type } from "class-transformer";
import {
  ProductImageRequestDto,
  ProductPriceRequestDto,
} from "./create-product.dto";

export class UpdateProductDto {
  @ApiProperty({ description: "Slug único do produto", required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public slug?: string;

  @ApiProperty({ description: "Nome do produto", required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  public name?: string;

  @ApiProperty({ description: "Marca do produto", required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  public brand?: string;

  @ApiProperty({ description: "SKU único do produto", required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  public sku?: string;

  @ApiProperty({ description: "Descrição do produto", required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  public description?: string;

  @ApiProperty({ description: "Quantidade em estoque", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  public stock?: number;

  @ApiProperty({ description: "Preço do produto", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductPriceRequestDto)
  public price?: ProductPriceRequestDto;

  @ApiProperty({
    description: "Imagens do produto",
    type: [ProductImageRequestDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageRequestDto)
  public images?: ProductImageRequestDto[];

  @ApiProperty({ description: "Se o produto está ativo", required: false })
  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
