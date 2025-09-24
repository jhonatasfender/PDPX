import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/controllers/user/auth.controller';
import { AdminController } from '../presentation/controllers/admin/admin.controller';
import { RegisterUserUseCase } from '../application/user/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../application/user/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../application/user/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from '../application/user/use-cases/logout-user.use-case';
import { GetCurrentUserUseCase } from '../application/user/use-cases/get-current-user.use-case';
import { SupabaseService } from '../infrastructure/user/external-services/supabase.service';
import { SupabaseTokenService } from '../infrastructure/user/external-services/token.service';
import { AuthGuard } from '../presentation/guards/auth.guard';
import { RolesGuard } from '../presentation/guards/roles.guard';
import { UserRepository } from '../infrastructure/user/repositories/user.repository';
import { UserSyncRepositoryImpl } from '../infrastructure/user/repositories/user-sync.repository';
import { AuthenticateUserUseCase } from '../application/user/use-cases/authenticate-user.use-case';

@Module({
  controllers: [AuthController, AdminController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    GetCurrentUserUseCase,
    AuthenticateUserUseCase,
    SupabaseService,
    SupabaseTokenService,
    AuthGuard,
    RolesGuard,
    UserRepository,
    UserSyncRepositoryImpl,
    {
      provide: 'TokenService',
      useClass: SupabaseTokenService,
    },
    {
      provide: 'UserSyncRepository',
      useClass: UserSyncRepositoryImpl,
    },
  ],
  exports: [
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    GetCurrentUserUseCase,
    AuthenticateUserUseCase,
    SupabaseService,
    SupabaseTokenService,
    AuthGuard,
    RolesGuard,
    UserSyncRepositoryImpl,
  ],
})
export class AuthModule {}

