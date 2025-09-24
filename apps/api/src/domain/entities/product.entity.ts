export class Product {
  private constructor(
    private readonly _id: string,
    private readonly _slug: string,
    private readonly _name: string,
    private readonly _brand: string,
    private readonly _sku: string,
    private readonly _description: string,
    private readonly _stock: number,
    private readonly _isActive: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  public static create(
    id: string,
    slug: string,
    name: string,
    brand: string,
    sku: string,
    description: string,
    stock: number = 0,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): Product {
    return new Product(
      id,
      slug,
      name,
      brand,
      sku,
      description,
      stock,
      isActive,
      createdAt,
      updatedAt,
    );
  }

  public static fromPrisma(data: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    sku: string;
    description: string;
    stock: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }): Product {
    return new Product(
      data.id,
      data.slug,
      data.name,
      data.brand,
      data.sku,
      data.description,
      data.stock,
      data.is_active,
      data.created_at,
      data.updated_at,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get slug(): string {
    return this._slug;
  }

  public get name(): string {
    return this._name;
  }

  public get brand(): string {
    return this._brand;
  }

  public get sku(): string {
    return this._sku;
  }

  public get description(): string {
    return this._description;
  }

  public get stock(): number {
    return this._stock;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public toJSON(): any {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      brand: this.brand,
      sku: this.sku,
      description: this.description,
      stock: this.stock,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
