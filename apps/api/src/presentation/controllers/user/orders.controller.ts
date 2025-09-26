import { Controller, Get, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { RequireUser } from "../../decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserData,
} from "../../decorators/current-user.decorator";
import { ListOrdersUseCase } from "../../../application/order/use-cases/list-orders.use-case";

@Controller("orders")
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  public constructor(private readonly listOrders: ListOrdersUseCase) {}

  @Get()
  @RequireUser()
  @HttpCode(HttpStatus.OK)
  public async list(@CurrentUser() user: CurrentUserData) {
    const userId = user.custom?.id as string;
    return await this.listOrders.execute({ userId });
  }
}
