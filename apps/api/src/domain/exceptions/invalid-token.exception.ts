import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidTokenException extends HttpException {
  public constructor() {
    super(
      {
        message: "Token inválido.",
        error: "INVALID_TOKEN",
        statusCode: HttpStatus.UNAUTHORIZED,
        action: "REFRESH_TOKEN",
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
