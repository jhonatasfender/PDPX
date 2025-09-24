import { HttpException, HttpStatus } from "@nestjs/common";

export class TokenExpiredException extends HttpException {
  public constructor() {
    super(
      {
        message: "Token expirado. Faça login novamente.",
        error: "TOKEN_EXPIRED",
        statusCode: HttpStatus.UNAUTHORIZED,
        action: "REFRESH_TOKEN",
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
