import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { RequireUser } from "../../decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserData,
} from "../../decorators/current-user.decorator";
import { BagMapper } from "../../mappers/bag.mapper";
import { AddItemToBagDto } from "../../dto/bag/add-item-to-bag.dto";
import { UpdateItemQuantityDto } from "../../dto/bag/update-item-quantity.dto";
import { RemoveItemFromBagDto } from "../../dto/bag/remove-item-from-bag.dto";
import {
  GetBagResponseDto,
  AddItemToBagResponseDto,
  UpdateItemQuantityResponseDto,
  RemoveItemFromBagResponseDto,
  ClearBagResponseDto,
} from "../../dto/bag/bag-response.dto";
import { AddItemToBagUseCase } from "../../../application/bag/use-cases/add-item-to-bag.use-case";
import { GetBagUseCase } from "../../../application/bag/use-cases/get-bag.use-case";
import { UpdateItemQuantityUseCase } from "../../../application/bag/use-cases/update-item-quantity.use-case";
import { RemoveItemFromBagUseCase } from "../../../application/bag/use-cases/remove-item-from-bag.use-case";
import { ClearBagUseCase } from "../../../application/bag/use-cases/clear-bag.use-case";
import { ConvertBagUseCase } from "../../../application/bag/use-cases/convert-bag.use-case";
import { UserNotAuthenticatedException } from "../../../domain/exceptions/bag-exceptions";

@ApiTags("Carrinho")
@Controller("bag")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth("JWT-auth")
export class BagController {
  public constructor(
    private readonly addItemToBagUseCase: AddItemToBagUseCase,
    private readonly getBagUseCase: GetBagUseCase,
    private readonly updateItemQuantityUseCase: UpdateItemQuantityUseCase,
    private readonly removeItemFromBagUseCase: RemoveItemFromBagUseCase,
    private readonly clearBagUseCase: ClearBagUseCase,
    private readonly convertBagUseCase: ConvertBagUseCase,
  ) {}

  @Get()
  @RequireUser()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Obter carrinho",
    description: "Retorna o carrinho ativo do usuário com todos os itens",
  })
  @ApiResponse({
    status: 200,
    description: "Carrinho obtido com sucesso",
    type: GetBagResponseDto,
  })
  public async getBag(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GetBagResponseDto> {
    if (!user.custom?.id) {
      throw new UserNotAuthenticatedException();
    }
    const request = { userId: user.custom.id };
    const response = await this.getBagUseCase.execute(request);
    return BagMapper.toGetBagResponse(response);
  }

  @Post("items")
  @RequireUser()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Adicionar item ao carrinho",
    description: "Adiciona um produto ao carrinho do usuário",
  })
  @ApiResponse({
    status: 201,
    description: "Item adicionado ao carrinho com sucesso",
    type: AddItemToBagResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos",
  })
  public async addItemToBag(
    @CurrentUser() user: CurrentUserData,
    @Body() addItemDto: AddItemToBagDto,
  ): Promise<AddItemToBagResponseDto> {
    if (!user.custom?.id) {
      throw new UserNotAuthenticatedException();
    }
    const request = BagMapper.toAddItemRequest(user.custom.id, addItemDto);
    const response = await this.addItemToBagUseCase.execute(request);
    return BagMapper.toAddItemToBagResponse(response);
  }

  @Put("items/quantity")
  @RequireUser()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Atualizar quantidade do item",
    description: "Atualiza a quantidade de um item no carrinho",
  })
  @ApiResponse({
    status: 200,
    description: "Quantidade atualizada com sucesso",
    type: UpdateItemQuantityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos",
  })
  @ApiResponse({
    status: 404,
    description: "Item não encontrado no carrinho",
  })
  public async updateItemQuantity(
    @CurrentUser() user: CurrentUserData,
    @Body() updateQuantityDto: UpdateItemQuantityDto,
  ): Promise<UpdateItemQuantityResponseDto> {
    if (!user.custom?.id) {
      throw new UserNotAuthenticatedException();
    }
    const request = BagMapper.toUpdateItemQuantityRequest(
      user.custom.id,
      updateQuantityDto,
    );
    const response = await this.updateItemQuantityUseCase.execute(request);
    return BagMapper.toUpdateItemQuantityResponse(response);
  }

  @Delete("items")
  @RequireUser()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Remover item do carrinho",
    description: "Remove um produto do carrinho do usuário",
  })
  @ApiResponse({
    status: 200,
    description: "Item removido do carrinho com sucesso",
    type: RemoveItemFromBagResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Item não encontrado no carrinho",
  })
  public async removeItemFromBag(
    @CurrentUser() user: CurrentUserData,
    @Body() removeItemDto: RemoveItemFromBagDto,
  ): Promise<RemoveItemFromBagResponseDto> {
    if (!user.custom?.id) {
      throw new UserNotAuthenticatedException();
    }
    const request = BagMapper.toRemoveItemRequest(
      user.custom.id,
      removeItemDto,
    );
    const response = await this.removeItemFromBagUseCase.execute(request);
    return BagMapper.toRemoveItemFromBagResponse(response);
  }

  @Delete()
  @RequireUser()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Limpar carrinho",
    description: "Remove todos os itens do carrinho do usuário",
  })
  @ApiResponse({
    status: 200,
    description: "Carrinho limpo com sucesso",
    type: ClearBagResponseDto,
  })
  public async clearBag(
    @CurrentUser() user: CurrentUserData,
  ): Promise<ClearBagResponseDto> {
    if (!user.custom?.id) {
      throw new UserNotAuthenticatedException();
    }
    const request = { userId: user.custom.id };
    const response = await this.clearBagUseCase.execute(request);
    return BagMapper.toClearBagResponse(response);
  }

  @Post("checkout")
  @RequireUser()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Finalizar compra",
    description: "Converte a bag ativa em pedido e cria nova bag ativa",
  })
  public async checkout(
    @CurrentUser() user: CurrentUserData,
  ): Promise<{ success: boolean; message: string }> {
    if (!user.custom?.id) {
      throw new UserNotAuthenticatedException();
    }
    const response = await this.convertBagUseCase.execute({
      userId: user.custom.id,
    });
    return response;
  }
}
