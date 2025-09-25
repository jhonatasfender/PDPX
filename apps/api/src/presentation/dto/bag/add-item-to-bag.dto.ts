import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, Min } from "class-validator";

export class AddItemToBagDto {
  @ApiProperty({
    description: "ID do produto",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  public productId!: string;

  @ApiProperty({
    description: "Quantidade do produto",
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  public quantity!: number;
}
