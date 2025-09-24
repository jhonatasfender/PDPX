import { Email } from "../user/value-objects/email.vo";
import { Role, UserRole } from "../user/value-objects/role.vo";

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: Email,
    private readonly _name: string,
    private readonly _role: Role,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  public static create(
    id: string,
    email: string,
    name: string,
    role: UserRole = UserRole.USER,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): User {
    return new User(
      id,
      new Email(email),
      name,
      new Role(role),
      createdAt,
      updatedAt,
    );
  }

  public static fromPrisma(data: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
  }): User {
    return new User(
      data.id,
      new Email(data.email),
      data.name,
      new Role(data.role),
      data.created_at,
      data.updated_at,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get email(): string {
    return this._email.getValue();
  }

  public get name(): string {
    return this._name;
  }

  public get role(): UserRole {
    return this._role.getValue();
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public getRoleObject(): Role {
    return this._role;
  }

  public isAdmin(): boolean {
    return this._role.isAdmin();
  }

  public isSuperAdmin(): boolean {
    return this._role.isSuperAdmin();
  }

  public isUser(): boolean {
    return this._role.isUser();
  }

  public hasPermission(requiredRole: UserRole): boolean {
    return this._role.hasPermission(requiredRole);
  }

  public canAccessAdminPanel(): boolean {
    return this.isAdmin();
  }

  public canManageUsers(): boolean {
    return this.isSuperAdmin();
  }

  public canManageProducts(): boolean {
    return this.isAdmin();
  }

  public toJSON(): any {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
