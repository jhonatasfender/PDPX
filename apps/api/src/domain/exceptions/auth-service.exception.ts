import { HttpException, HttpStatus } from "@nestjs/common";

export class AuthServiceException extends HttpException {
  public constructor(message: string, originalError?: any) {
    super(
      {
        message: "Erro interno do serviço de autenticação.",
        error: "AUTH_SERVICE_ERROR",
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
