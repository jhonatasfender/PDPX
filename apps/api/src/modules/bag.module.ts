import { Module } from "@nestjs/common";
import { BagController } from "../presentation/controllers/bag/bag.controller";
import { AddItemToBagUseCase } from "../application/bag/use-cases/add-item-to-bag.use-case";
import { GetBagUseCase } from "../application/bag/use-cases/get-bag.use-case";
import { UpdateItemQuantityUseCase } from "../application/bag/use-cases/update-item-quantity.use-case";
import { RemoveItemFromBagUseCase } from "../application/bag/use-cases/remove-item-from-bag.use-case";
import { ClearBagUseCase } from "../application/bag/use-cases/clear-bag.use-case";
import { ConvertBagUseCase } from "../application/bag/use-cases/convert-bag.use-case";
import { PrismaBagRepository } from "../infra/bag/repositories/prisma-bag.repository";
import { PrismaBagItemRepository } from "../infra/bag/repositories/prisma-bag-item.repository";
import { UserModule } from "./user.module";
import { ProductModule } from "./product.module";
import { UserSyncRepositoryImpl } from "../infra/user/repositories/user-sync.repository";
import { PermissionRepository } from "../infra/user/repositories/permission.repository";

@Module({
  imports: [UserModule, ProductModule],
  controllers: [BagController],
  providers: [
    AddItemToBagUseCase,
    GetBagUseCase,
    UpdateItemQuantityUseCase,
    RemoveItemFromBagUseCase,
    ClearBagUseCase,
    ConvertBagUseCase,
    { provide: "BagRepository", useClass: PrismaBagRepository },
    { provide: "BagItemRepository", useClass: PrismaBagItemRepository },
    { provide: "UserSyncRepository", useClass: UserSyncRepositoryImpl },
    PermissionRepository,
  ],
})
export class BagModule {}
