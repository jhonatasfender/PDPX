import { api } from "@/lib/http";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

export class AuthService {
  public static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`/auth/login`, data);
    return response.data;
  }

  public static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`/auth/register`, data);
    return response.data;
  }

  public static async getCurrentUser(): Promise<{
    message: string;
    user: User;
  }> {
    const response = await api.get<{ message: string; user: User }>(`/auth/me`);
    return response.data;
  }

  public static async logout(): Promise<void> {
    await api.post(`/auth/logout`);
  }

  public static async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`/auth/refresh`);
    return response.data;
  }

  public static setAuthToken(token: string): void {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  public static removeAuthToken(): void {
    delete api.defaults.headers.common["Authorization"];
  }
}
