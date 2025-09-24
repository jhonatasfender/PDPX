import { Injectable, Inject } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { ITokenService } from '../interfaces/token.interface';
import { PrismaService } from '../../../infra/prisma/prisma.service';

export interface GetCurrentUserRequest {
  token: string;
}

export interface GetCurrentUserResponse {
  user: User;
  customUser?: {
    id: string;
    auth_user_id: string;
    name: string | null;
    role: string;
  } | null;
}

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject('TokenService') private readonly tokenService: ITokenService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(request: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    const user = await this.tokenService.verifyAccessToken(request.token);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const customUser = await this.prisma.users.findUnique({
      where: { auth_user_id: user.id },
      select: {
        id: true,
        auth_user_id: true,
        name: true,
        role: true,
      },
    });

    return { user, customUser };
  }
}

