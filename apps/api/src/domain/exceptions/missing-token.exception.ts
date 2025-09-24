import { HttpException, HttpStatus } from "@nestjs/common";

export class MissingTokenException extends HttpException {
  public constructor() {
    super(
      {
        message: "Token de acesso não fornecido",
        error: "MISSING_TOKEN",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
