import { BagStatus } from "@prisma/client";

export class Bag {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _status: BagStatus,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _expiresAt: Date | null,
  ) {}

  public static create(
    id: string,
    userId: string,
    status: BagStatus = BagStatus.ACTIVE,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    expiresAt: Date | null = null,
  ): Bag {
    return new Bag(id, userId, status, createdAt, updatedAt, expiresAt);
  }

  public static fromPrisma(data: {
    id: string;
    user_id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    expires_at: Date | null;
  }): Bag {
    return new Bag(
      data.id,
      data.user_id,
      data.status as BagStatus,
      data.created_at,
      data.updated_at,
      data.expires_at,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get status(): BagStatus {
    return this._status;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get expiresAt(): Date | null {
    return this._expiresAt;
  }

  public isActive(): boolean {
    return this._status === BagStatus.ACTIVE;
  }

  public isExpired(): boolean {
    if (!this._expiresAt) return false;
    return new Date() > this._expiresAt;
  }

  public toJSON(): any {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      expiresAt: this.expiresAt,
    };
  }
}
