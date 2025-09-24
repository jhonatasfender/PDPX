import { Injectable, Inject } from '@nestjs/common';
import { User, Session } from '@supabase/supabase-js';
import { TokenService } from '../interfaces/token.interface';
import { UserSyncRepository } from '../interfaces/user-sync.repository';

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  user: User | null;
  session: Session | null;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenService,
    @Inject('UserSyncRepository') private readonly userSyncRepository: UserSyncRepository,
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    const authResponse = await this.tokenService.signInWithPassword(request.email, request.password);
    
    if (!authResponse.user) {
      throw new Error('Falha ao fazer login');
    }

    try {
      await this.userSyncRepository.syncUserFromAuth(authResponse.user.id);
    } catch (error) {
      console.error('Erro ao sincronizar usuário no login:', error);
    }
    
    return {
      user: authResponse.user,
      session: authResponse.session,
    };
  }
}

