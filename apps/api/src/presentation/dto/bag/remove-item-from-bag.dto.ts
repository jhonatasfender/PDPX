import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RemoveItemFromBagDto {
  @ApiProperty({
    description: "ID do produto",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  public productId!: string;
}
