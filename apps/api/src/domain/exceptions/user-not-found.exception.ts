import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
  public constructor(email: string) {
    super(
      {
        message: "Usuário não encontrado.",
        error: "USER_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
        details: {
          email,
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
