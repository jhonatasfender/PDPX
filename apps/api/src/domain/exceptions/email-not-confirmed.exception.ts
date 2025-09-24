import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailNotConfirmedException extends HttpException {
  public constructor(email: string) {
    super(
      {
        message:
          "Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.",
        error: "EMAIL_NOT_CONFIRMED",
        statusCode: HttpStatus.FORBIDDEN,
        details: {
          email,
          action: "CONFIRM_EMAIL",
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
