import { Module } from "@nestjs/common";
import { AppController } from "./presentation/controllers/app.controller";
import { PrismaModule } from "./infra/prisma/prisma.module";
import { UserModule } from "./modules/user.module";
import { ProductModule } from "./modules/product.module";
import { BagModule } from "./modules/bag.module";
import { OrdersModule } from "./modules/orders.module";

@Module({
  imports: [PrismaModule, UserModule, ProductModule, BagModule, OrdersModule],
  controllers: [AppController],
})
export class AppModule {}
