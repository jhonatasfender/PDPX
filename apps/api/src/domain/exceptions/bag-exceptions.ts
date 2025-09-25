import { HttpException, HttpStatus } from "@nestjs/common";

export class BagNotFoundException extends HttpException {
  public constructor(identifier: string) {
    super(
      {
        message: `Carrinho '${identifier}' não encontrado`,
        error: "BAG_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class BagItemNotFoundException extends HttpException {
  public constructor(identifier: string) {
    super(
      {
        message: `Item do carrinho '${identifier}' não encontrado`,
        error: "BAG_ITEM_NOT_FOUND",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ProductNotAvailableException extends HttpException {
  public constructor(productId: string) {
    super(
      {
        message: `Produto '${productId}' não está disponível ou não possui preço`,
        error: "PRODUCT_NOT_AVAILABLE",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidQuantityException extends HttpException {
  public constructor(quantity: number) {
    super(
      {
        message: `Quantidade '${quantity}' inválida. Deve ser maior que zero`,
        error: "INVALID_QUANTITY",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UserNotAuthenticatedException extends HttpException {
  public constructor() {
    super(
      {
        message: "Usuário não autenticado ou dados de usuário não encontrados",
        error: "USER_NOT_AUTHENTICATED",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class BagItemAlreadyExistsException extends HttpException {
  public constructor(productId: string) {
    super(
      {
        message: `Produto '${productId}' já está no carrinho`,
        error: "BAG_ITEM_ALREADY_EXISTS",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class BagLimitExceededException extends HttpException {
  public constructor(maxItems: number) {
    super(
      {
        message: `Limite de itens no carrinho excedido. Máximo permitido: ${maxItems}`,
        error: "BAG_LIMIT_EXCEEDED",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InsufficientStockException extends HttpException {
  public constructor(
    productId: string,
    requestedQuantity: number,
    availableStock: number,
  ) {
    super(
      {
        message: `Estoque insuficiente para o produto '${productId}'. Solicitado: ${requestedQuantity}, Disponível: ${availableStock}`,
        error: "INSUFFICIENT_STOCK",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BagOperationNotAllowedException extends HttpException {
  public constructor(operation: string) {
    super(
      {
        message: `Operação '${operation}' não permitida no carrinho`,
        error: "BAG_OPERATION_NOT_ALLOWED",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class BagEmptyException extends HttpException {
  public constructor() {
    super(
      {
        message: "Carrinho está vazio",
        error: "BAG_EMPTY",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
