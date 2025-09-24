import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidParametersException extends HttpException {
  constructor(message: string) {
    super(
      {
        message,
        error: "INVALID_PARAMETERS",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
