import { Injectable, Inject } from '@nestjs/common';
import { User, Session } from '@supabase/supabase-js';
import { ITokenService } from '../interfaces/token.interface';
import { UserSyncRepository } from '../interfaces/user-sync.repository';

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserResponse {
  user: User | null;
  session: Session | null;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('TokenService') private readonly tokenService: ITokenService,
    @Inject('UserSyncRepository') private readonly userSyncRepository: UserSyncRepository,
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    const authResponse = await this.tokenService.signUp(request.email, request.password, request.name);
    
    if (!authResponse.user) {
      throw new Error('Falha ao criar usuário');
    }

    try {
      await this.userSyncRepository.syncUserFromAuth(authResponse.user.id);
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error);
    }

    return {
      user: authResponse.user,
      session: authResponse.session,
    };
  }
}

