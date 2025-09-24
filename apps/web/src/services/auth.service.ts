import { api } from "@/lib/http";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `/auth/login`,
      data
    );
    return response.data;
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `/auth/register`,
      data
    );
    return response.data;
  }

  static async getCurrentUser(): Promise<{ message: string; user: User }> {
    const response = await api.get<{ message: string; user: User }>(
      `/auth/me`
    );
    return response.data;
  }

  static async logout(): Promise<void> {
    await api.post(`/auth/logout`);
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `/auth/refresh`
    );
    return response.data;
  }

  static setAuthToken(token: string): void {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  static removeAuthToken(): void {
    delete api.defaults.headers.common["Authorization"];
  }
}
