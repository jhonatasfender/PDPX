export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class Role {
  private readonly value: UserRole;

  constructor(role: UserRole) {
    this.validateRole(role);
    this.value = role;
  }

  private validateRole(role: UserRole): void {
    if (!Object.values(UserRole).includes(role)) {
      throw new Error(`Role inválido: ${role}`);
    }
  }

  getValue(): UserRole {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }

  isAdmin(): boolean {
    return this.value === UserRole.ADMIN || this.value === UserRole.SUPERADMIN;
  }

  isSuperAdmin(): boolean {
    return this.value === UserRole.SUPERADMIN;
  }

  isUser(): boolean {
    return this.value === UserRole.USER;
  }

  hasPermission(requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.USER]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPERADMIN]: 3,
    };

    return roleHierarchy[this.value] >= roleHierarchy[requiredRole];
  }

  static fromString(roleString: string): Role {
    const role = roleString.toUpperCase() as UserRole;
    return new Role(role);
  }

  static createUser(): Role {
    return new Role(UserRole.USER);
  }

  static createAdmin(): Role {
    return new Role(UserRole.ADMIN);
  }

  static createSuperAdmin(): Role {
    return new Role(UserRole.SUPERADMIN);
  }
}
