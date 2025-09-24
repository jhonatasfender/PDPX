import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsException extends HttpException {
  public constructor() {
    super(
      {
        message: "Credenciais incorretas. Verifique seu email e senha e tente novamente.",
        error: "INVALID_CREDENTIALS",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
