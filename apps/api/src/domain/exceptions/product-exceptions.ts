import { HttpException, HttpStatus } from "@nestjs/common";

export class ProductNotFoundException extends HttpException {
  public constructor(identifier: string) {
    super(
      {
        message: `Produto '${identifier}' não encontrado`,
        error: "PRODUCT_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ProductSlugAlreadyExistsException extends HttpException {
  public constructor(slug: string) {
    super(
      {
        message: `Já existe um produto com o slug '${slug}'`,
        error: "PRODUCT_SLUG_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class ProductSkuAlreadyExistsException extends HttpException {
  public constructor(sku: string) {
    super(
      {
        message: `Já existe um produto com o SKU '${sku}'`,
        error: "PRODUCT_SKU_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}
