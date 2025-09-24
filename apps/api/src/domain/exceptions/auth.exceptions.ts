import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotConfirmedException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.',
        error: 'EMAIL_NOT_CONFIRMED',
        statusCode: HttpStatus.FORBIDDEN,
        details: {
          email,
          action: 'CONFIRM_EMAIL',
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Credenciais inválidas. Verifique seu email e senha.',
        error: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: 'Usuário não encontrado.',
        error: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
        details: {
          email,
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: 'Usuário já existe com este email.',
        error: 'USER_ALREADY_EXISTS',
        statusCode: HttpStatus.CONFLICT,
        details: {
          email,
        },
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class TokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        message: 'Token expirado. Faça login novamente.',
        error: 'TOKEN_EXPIRED',
        statusCode: HttpStatus.UNAUTHORIZED,
        action: 'REFRESH_TOKEN',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super(
      {
        message: 'Token inválido.',
        error: 'INVALID_TOKEN',
        statusCode: HttpStatus.UNAUTHORIZED,
        action: 'REFRESH_TOKEN',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AuthServiceException extends HttpException {
  constructor(message: string, originalError?: any) {
    super(
      {
        message: 'Erro interno do serviço de autenticação.',
        error: 'AUTH_SERVICE_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: {
          originalMessage: message,
          originalError: originalError?.message || originalError,
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
