import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsException extends HttpException {
  public constructor() {
    super(
      {
        message: "Credenciais inválidas. Verifique seu email e senha.",
        error: "INVALID_CREDENTIALS",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
