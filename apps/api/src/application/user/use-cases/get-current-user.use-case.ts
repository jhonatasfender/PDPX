import { Injectable, Inject } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { TokenService } from '../interfaces/token.interface';

export interface GetCurrentUserRequest {
  token: string;
}

export interface GetCurrentUserResponse {
  user: User;
}

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  async execute(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    const user = await this.tokenService.verifyAccessToken(request.token);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return { user };
  }
}

