export class ProductImage {
  private constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private readonly _url: string,
    private readonly _alt: string | null,
    private readonly _isPrimary: boolean,
    private readonly _position: number,
    private readonly _createdAt: Date,
  ) {}

  public static create(
    id: string,
    productId: string,
    url: string,
    alt: string | null = null,
    isPrimary: boolean = false,
    position: number = 0,
    createdAt: Date = new Date(),
  ): ProductImage {
    return new ProductImage(
      id,
      productId,
      url,
      alt,
      isPrimary,
      position,
      createdAt,
    );
  }

  public static fromPrisma(data: {
    id: string;
    product_id: string;
    url: string;
    alt: string | null;
    is_primary: boolean;
    position: number;
    created_at: Date;
  }): ProductImage {
    return new ProductImage(
      data.id,
      data.product_id,
      data.url,
      data.alt,
      data.is_primary,
      data.position,
      data.created_at,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get productId(): string {
    return this._productId;
  }

  public get url(): string {
    return this._url;
  }

  public get alt(): string | null {
    return this._alt;
  }

  public get isPrimary(): boolean {
    return this._isPrimary;
  }

  public get position(): number {
    return this._position;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public toJSON(): any {
    return {
      id: this.id,
      productId: this.productId,
      url: this.url,
      alt: this.alt,
      isPrimary: this.isPrimary,
      position: this.position,
      createdAt: this.createdAt,
    };
  }
}
