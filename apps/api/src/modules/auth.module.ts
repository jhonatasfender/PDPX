import { Module } from "@nestjs/common";
import { AuthController } from "../presentation/controllers/user/auth.controller";
import { AdminController } from "../presentation/controllers/admin/admin.controller";
import { AdminProductController } from "../presentation/controllers/admin/product.controller";
import { RegisterUserUseCase } from "../application/user/use-cases/register-user.use-case";
import { LoginUserUseCase } from "../application/user/use-cases/login-user.use-case";
import { RefreshTokenUseCase } from "../application/user/use-cases/refresh-token.use-case";
import { LogoutUserUseCase } from "../application/user/use-cases/logout-user.use-case";
import { GetCurrentUserUseCase } from "../application/user/use-cases/get-current-user.use-case";
import { GetCurrentUserWithPublicDataUseCase } from "../application/user/use-cases/get-current-user-with-public-data.use-case";
import { SupabaseAdapter } from "../infra/user/adapters/supabase.adapter";
import { SupabaseTokenAdapter } from "../infra/user/adapters/token.adapter";
import { AuthGuard } from "../presentation/guards/auth.guard";
import { RolesGuard } from "../presentation/guards/roles.guard";
import { UserRepository } from "../infra/user/repositories/user.repository";
import { UserSyncRepositoryImpl } from "../infra/user/repositories/user-sync.repository";
import { AuthenticateUserUseCase } from "../application/user/use-cases/authenticate-user.use-case";
import { CheckUserPermissionUseCase } from "../application/user/use-cases/check-user-permission.use-case";
import { UpdateLastSignInUseCase } from "../application/user/use-cases/update-last-sign-in.use-case";
import { AuthUserRepository } from "../infra/user/repositories/auth-user.repository";
import { PermissionRepository } from "../infra/user/repositories/permission.repository";
import { CreateProductUseCase } from "../application/product/use-cases/create-product.use-case";
import { GetProductUseCase } from "../application/product/use-cases/get-product.use-case";
import { ListProductsUseCase } from "../application/product/use-cases/list-products.use-case";
import { UpdateProductUseCase } from "../application/product/use-cases/update-product.use-case";
import { DeleteProductUseCase } from "../application/product/use-cases/delete-product.use-case";
import { PrismaProductRepository } from "../infra/product/repositories/prisma-product.repository";
import { PrismaProductImageRepository } from "../infra/product/repositories/prisma-product-image.repository";
import { PrismaProductPriceRepository } from "../infra/product/repositories/prisma-product-price.repository";

@Module({
  controllers: [AuthController, AdminController, AdminProductController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    GetCurrentUserUseCase,
    GetCurrentUserWithPublicDataUseCase,
    AuthenticateUserUseCase,
    CheckUserPermissionUseCase,
    UpdateLastSignInUseCase,
    AuthUserRepository,
    PermissionRepository,
    SupabaseAdapter,
    SupabaseTokenAdapter,
    AuthGuard,
    RolesGuard,
    UserRepository,
    UserSyncRepositoryImpl,
    {
      provide: "TokenService",
      useClass: SupabaseTokenAdapter,
    },
    {
      provide: "UserSyncRepository",
      useClass: UserSyncRepositoryImpl,
    },
    CreateProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    {
      provide: "ProductRepository",
      useClass: PrismaProductRepository,
    },
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
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    GetCurrentUserUseCase,
    GetCurrentUserWithPublicDataUseCase,
    AuthenticateUserUseCase,
    CheckUserPermissionUseCase,
    UpdateLastSignInUseCase,
    AuthUserRepository,
    PermissionRepository,
    SupabaseAdapter,
    SupabaseTokenAdapter,
    AuthGuard,
    RolesGuard,
    UserSyncRepositoryImpl,
    "TokenService",
  ],
})
export class AuthModule {}
