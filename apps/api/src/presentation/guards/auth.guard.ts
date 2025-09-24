import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../application/user/interfaces/token.interface.js';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Token de acesso não fornecido',
        error: 'MISSING_TOKEN',
        statusCode: 401,
      });
    }

    try {
      const user = await this.tokenService.verifyAccessToken(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Token inválido ou expirado',
        error: 'INVALID_TOKEN',
        statusCode: 401,
      });
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
