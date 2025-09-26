import { Module } from "@nestjs/common";
import { OrdersController } from "../presentation/controllers/user/orders.controller";
import { UserModule } from "./user.module";
import { PrismaBagRepository } from "../infra/bag/repositories/prisma-bag.repository";
import { PermissionRepository } from "../infra/user/repositories/permission.repository";
import { UserSyncRepositoryImpl } from "../infra/user/repositories/user-sync.repository";
import { PrismaBagItemRepository } from "../infra/bag/repositories/prisma-bag-item.repository";
import { ProductModule } from "./product.module";
import { ListOrdersUseCase } from "../application/order/use-cases/list-orders.use-case";

@Module({
  imports: [UserModule, ProductModule],
  controllers: [OrdersController],
  providers: [
    ListOrdersUseCase,
    { provide: "BagRepository", useClass: PrismaBagRepository },
    { provide: "BagItemRepository", useClass: PrismaBagItemRepository },
    PermissionRepository,
    { provide: "UserSyncRepository", useClass: UserSyncRepositoryImpl },
  ],
})
export class OrdersModule {}
