export class BagItem {
  private constructor(
    private readonly _id: string,
    private readonly _bagId: string,
    private readonly _productId: string,
    private readonly _quantity: number,
    private readonly _priceCents: number,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  public static create(
    id: string,
    bagId: string,
    productId: string,
    quantity: number = 1,
    priceCents: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): BagItem {
    if (quantity <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }
    if (priceCents < 0) {
      throw new Error("Preço não pode ser negativo");
    }

    return new BagItem(
      id,
      bagId,
      productId,
      quantity,
      priceCents,
      createdAt,
      updatedAt,
    );
  }

  public static fromPrisma(data: {
    id: string;
    bag_id: string;
    product_id: string;
    quantity: number;
    price_cents: number;
    created_at: Date;
    updated_at: Date;
  }): BagItem {
    return new BagItem(
      data.id,
      data.bag_id,
      data.product_id,
      data.quantity,
      data.price_cents,
      data.created_at,
      data.updated_at,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get bagId(): string {
    return this._bagId;
  }

  public get productId(): string {
    return this._productId;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get priceCents(): number {
    return this._priceCents;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public getTotalPriceCents(): number {
    return this._quantity * this._priceCents;
  }

  public getTotalPrice(): number {
    return this.getTotalPriceCents() / 100;
  }

  public getPrice(): number {
    return this._priceCents / 100;
  }

  public toJSON(): any {
    return {
      id: this.id,
      bagId: this.bagId,
      productId: this.productId,
      quantity: this.quantity,
      priceCents: this.priceCents,
      price: this.getPrice(),
      totalPriceCents: this.getTotalPriceCents(),
      totalPrice: this.getTotalPrice(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
