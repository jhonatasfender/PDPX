import { ApiProperty } from '@nestjs/swagger';
import { Session } from '@supabase/supabase-js';
import { UserRole } from '../../../domain/user/value-objects/role.vo';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Role do usuário',
    example: UserRole.USER,
    enum: UserRole,
  })
  role!: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário criado com sucesso',
  })
  message!: string;

  @ApiProperty({
    description: 'Dados do usuário',
    type: UserResponseDto,
  })
  user!: UserResponseDto;

  @ApiProperty({
    description: 'Dados da sessão do Supabase',
  })
  session!: Session | null;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Login realizado com sucesso',
  })
  message!: string;

  @ApiProperty({
    description: 'Dados do usuário',
    type: UserResponseDto,
  })
  user!: UserResponseDto;

  @ApiProperty({
    description: 'Dados da sessão do Supabase',
  })
  session!: Session | null;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Token renovado com sucesso',
  })
  message!: string;

  @ApiProperty({
    description: 'Dados da sessão renovada',
    example: 'Objeto de sessão do Supabase',
  })
  session!: Session | null;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Logout realizado com sucesso',
  })
  message!: string;

  @ApiProperty({
    description: 'Status do logout',
    example: true,
  })
  success!: boolean;
}

export class MeResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário atual obtido com sucesso',
  })
  message!: string;

  @ApiProperty({
    description: 'Dados do usuário atual',
    type: UserResponseDto,
  })
  user!: UserResponseDto;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Credenciais inválidas',
  })
  message!: string;

  @ApiProperty({
    description: 'Código de erro específico',
    example: 'INVALID_CREDENTIALS',
  })
  error!: string;

  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/auth/login',
  })
  path!: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method!: string;

  @ApiProperty({
    description: 'Detalhes adicionais do erro',
    example: { email: 'usuario@exemplo.com' },
    required: false,
  })
  details?: any;
}

export class EmailNotConfirmedErrorDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.',
  })
  message!: string;

  @ApiProperty({
    description: 'Código de erro específico',
    example: 'EMAIL_NOT_CONFIRMED',
  })
  error!: string;

  @ApiProperty({
    description: 'Código de status HTTP',
    example: 403,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/auth/login',
  })
  path!: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method!: string;

  @ApiProperty({
    description: 'Detalhes do erro',
    example: { email: 'usuario@exemplo.com', action: 'CONFIRM_EMAIL' },
  })
  details!: {
    email: string;
    action: string;
  };
}

export class InvalidCredentialsErrorDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Credenciais inválidas. Verifique seu email e senha.',
  })
  message!: string;

  @ApiProperty({
    description: 'Código de erro específico',
    example: 'INVALID_CREDENTIALS',
  })
  error!: string;

  @ApiProperty({
    description: 'Código de status HTTP',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Timestamp do erro',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/auth/login',
  })
  path!: string;

  @ApiProperty({
    description: 'Método HTTP da requisição',
    example: 'POST',
  })
  method!: string;
}
