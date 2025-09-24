export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export class Role {
  private readonly value: UserRole;

  public constructor(role: UserRole) {
    this.validateRole(role);
    this.value = role;
  }

  private validateRole(role: UserRole): void {
    if (!Object.values(UserRole).includes(role)) {
      throw new Error(`Role inválido: ${role}`);
    }
  }

  public getValue(): UserRole {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: Role): boolean {
    return this.value === other.value;
  }

  public isAdmin(): boolean {
    return this.value === UserRole.ADMIN || this.value === UserRole.SUPERADMIN;
  }

  public isSuperAdmin(): boolean {
    return this.value === UserRole.SUPERADMIN;
  }

  public isUser(): boolean {
    return this.value === UserRole.USER;
  }

  public hasPermission(requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPERADMIN]: 3,
    };

    return roleHierarchy[this.value] >= roleHierarchy[requiredRole];
  }

  public static fromString(roleString: string): Role {
    const role = roleString.toUpperCase() as UserRole;
    return new Role(role);
  }

  public static createUser(): Role {
    return new Role(UserRole.USER);
  }

  public static createAdmin(): Role {
    return new Role(UserRole.ADMIN);
  }

  public static createSuperAdmin(): Role {
    return new Role(UserRole.SUPERADMIN);
  }
}
