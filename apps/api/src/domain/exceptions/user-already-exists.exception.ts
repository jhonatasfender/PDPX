import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
  public constructor(email: string) {
    super(
      {
        message: "Usuário já existe com este email.",
        error: "USER_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
        details: {
          email,
        },
      },
      HttpStatus.CONFLICT,
    );
  }
}
