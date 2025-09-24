export class ProductPrice {
  private constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private readonly _currency: string,
    private readonly _amountCents: number,
    private readonly _validFrom: Date,
    private readonly _validTo: Date | null,
    private readonly _createdAt: Date,
  ) {}

  public static create(
    id: string,
    productId: string,
    currency: string,
    amountCents: number,
    validFrom: Date = new Date(),
    validTo: Date | null = null,
    createdAt: Date = new Date(),
  ): ProductPrice {
    return new ProductPrice(
      id,
      productId,
      currency,
      amountCents,
      validFrom,
      validTo,
      createdAt,
    );
  }

  public static fromPrisma(data: {
    id: string;
    product_id: string;
    currency: string;
    amount_cents: number;
    valid_from: Date;
    valid_to: Date | null;
    created_at: Date;
  }): ProductPrice {
    return new ProductPrice(
      data.id,
      data.product_id,
      data.currency,
      data.amount_cents,
      data.valid_from,
      data.valid_to,
      data.created_at,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get productId(): string {
    return this._productId;
  }

  public get currency(): string {
    return this._currency;
  }

  public get amountCents(): number {
    return this._amountCents;
  }

  public get validFrom(): Date {
    return this._validFrom;
  }

  public get validTo(): Date | null {
    return this._validTo;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public getAmountInCurrency(): number {
    return this._amountCents / 100;
  }

  public toJSON(): any {
    return {
      id: this.id,
      productId: this.productId,
      currency: this.currency,
      amountCents: this.amountCents,
      amount: this.getAmountInCurrency(),
      validFrom: this.validFrom,
      validTo: this.validTo,
      createdAt: this.createdAt,
    };
  }
}

