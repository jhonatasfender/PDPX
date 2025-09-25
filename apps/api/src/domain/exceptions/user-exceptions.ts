import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthServiceException extends HttpException {
  public constructor(message: string) {
    super(
      {
        message,
        error: "AUTH_SERVICE_ERROR",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class EmailNotConfirmedException extends HttpException {
  public constructor(email: string) {
    super(
      {
        message: `Email '${email}' não foi confirmado. Verifique sua caixa de entrada.`,
        error: "EMAIL_NOT_CONFIRMED",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  public constructor() {
    super(
      {
        message: "Credenciais inválidas",
        error: "INVALID_CREDENTIALS",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidTokenException extends HttpException {
  public constructor() {
    super(
      {
        message: "Token inválido",
        error: "INVALID_TOKEN",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class MissingTokenException extends HttpException {
  public constructor() {
    super(
      {
        message: "Token não fornecido",
        error: "MISSING_TOKEN",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenExpiredException extends HttpException {
  public constructor() {
    super(
      {
        message: "Token expirado",
        error: "TOKEN_EXPIRED",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  public constructor(email: string) {
    super(
      {
        message: `Usuário com email '${email}' já existe`,
        error: "USER_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class UserNotFoundException extends HttpException {
  public constructor(identifier: string) {
    super(
      {
        message: `Usuário '${identifier}' não encontrado`,
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
