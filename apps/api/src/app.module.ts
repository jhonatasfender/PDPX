import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./infra/prisma/prisma.module";
import { AuthModule } from "./modules/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
