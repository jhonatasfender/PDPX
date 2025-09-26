import { Module } from "@nestjs/common";
import { AdminProductController } from "../presentation/controllers/admin/product.controller";
import { CatalogPublicController } from "../presentation/controllers/public/catalog.controller";
import { CreateProductUseCase } from "../application/product/use-cases/create-product.use-case";
import { GetProductUseCase } from "../application/product/use-cases/get-product.use-case";
import { ListProductsUseCase } from "../application/product/use-cases/list-products.use-case";
import { UpdateProductUseCase } from "../application/product/use-cases/update-product.use-case";
import { DeleteProductUseCase } from "../application/product/use-cases/delete-product.use-case";
import { ToggleProductStatusUseCase } from "../application/product/use-cases/toggle-product-status.use-case";
import { PrismaProductRepository } from "../infra/product/repositories/prisma-product.repository";
import { PrismaProductImageRepository } from "../infra/product/repositories/prisma-product-image.repository";
import { PrismaProductPriceRepository } from "../infra/product/repositories/prisma-product-price.repository";
import { UserModule } from "./user.module";

@Module({
  imports: [UserModule],
  controllers: [AdminProductController, CatalogPublicController],
  providers: [
    CreateProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ToggleProductStatusUseCase,
    { provide: "ProductRepository", useClass: PrismaProductRepository },
    {
      provide: "ProductImageRepository",
      useClass: PrismaProductImageRepository,
    },
    {
      provide: "ProductPriceRepository",
      useClass: PrismaProductPriceRepository,
    },
  ],
  exports: [
    "ProductRepository",
    "ProductImageRepository",
    "ProductPriceRepository",
    GetProductUseCase,
  ],
})
export class ProductModule {}
