import { ApiProperty } from "@nestjs/swagger";
import { BagStatus } from "@prisma/client";

export class BagItemResponseDto {
  @ApiProperty({ description: "ID do item" })
  public id!: string;

  @ApiProperty({ description: "ID da bag" })
  public bagId!: string;

  @ApiProperty({ description: "ID do produto" })
  public productId!: string;

  @ApiProperty({ description: "Quantidade" })
  public quantity!: number;

  @ApiProperty({ description: "Preço em centavos" })
  public priceCents!: number;

  @ApiProperty({ description: "Preço em reais" })
  public price!: number;

  @ApiProperty({ description: "Preço total em centavos" })
  public totalPriceCents!: number;

  @ApiProperty({ description: "Preço total em reais" })
  public totalPrice!: number;

  @ApiProperty({ description: "Data de criação" })
  public createdAt!: Date;

  @ApiProperty({ description: "Data de atualização" })
  public updatedAt!: Date;
}

export class BagResponseDto {
  @ApiProperty({ description: "ID da bag" })
  public id!: string;

  @ApiProperty({ description: "ID do usuário" })
  public userId!: string;

  @ApiProperty({ description: "Status da bag", enum: BagStatus })
  public status!: BagStatus;

  @ApiProperty({ description: "Data de criação" })
  public createdAt!: Date;

  @ApiProperty({ description: "Data de atualização" })
  public updatedAt!: Date;

  @ApiProperty({ description: "Data de expiração", required: false })
  public expiresAt?: Date | null;
}

export class GetBagResponseDto {
  @ApiProperty({ description: "Dados da bag", required: false })
  public bag?: BagResponseDto | null;

  @ApiProperty({ description: "Itens da bag", type: [BagItemResponseDto] })
  public bagItems!: BagItemResponseDto[];

  @ApiProperty({ description: "Total de itens" })
  public totalItems!: number;

  @ApiProperty({ description: "Preço total em centavos" })
  public totalPriceCents!: number;

  @ApiProperty({ description: "Preço total em reais" })
  public totalPrice!: number;
}

export class AddItemToBagResponseDto {
  @ApiProperty({ description: "Dados da bag" })
  public bag!: BagResponseDto;

  @ApiProperty({ description: "Item adicionado" })
  public bagItem!: BagItemResponseDto;
}

export class UpdateItemQuantityResponseDto {
  @ApiProperty({ description: "Item atualizado", required: false })
  public bagItem?: BagItemResponseDto | null;

  @ApiProperty({ description: "Sucesso da operação" })
  public success!: boolean;

  @ApiProperty({ description: "Mensagem" })
  public message!: string;
}

export class RemoveItemFromBagResponseDto {
  @ApiProperty({ description: "Sucesso da operação" })
  public success!: boolean;

  @ApiProperty({ description: "Mensagem" })
  public message!: string;
}

export class ClearBagResponseDto {
  @ApiProperty({ description: "Sucesso da operação" })
  public success!: boolean;

  @ApiProperty({ description: "Mensagem" })
  public message!: string;
}
