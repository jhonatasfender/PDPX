"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthService } from "@/services/auth.service";
import type {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  User,
  AuthSession,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        AuthService.setAuthToken(token);
        await getCurrentUser();
      }
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      AuthService.removeAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      const response = await AuthService.login(data);
      
      if (response.session) {
        setUser(response.user);
        setSession(response.session);
        
        localStorage.setItem("access_token", response.session.access_token);
        localStorage.setItem("refresh_token", response.session.refresh_token);
        
        AuthService.setAuthToken(response.session.access_token);
        
        await getCurrentUser();
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await AuthService.register(data);
      return response;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      AuthService.removeAuthToken();
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refresh_token");
      if (!refreshTokenValue) {
        throw new Error("Refresh token não encontrado");
      }

      const response = await AuthService.refreshToken();
      
      if (response.session) {
        setSession(response.session);
        localStorage.setItem("access_token", response.session.access_token);
        localStorage.setItem("refresh_token", response.session.refresh_token);
        AuthService.setAuthToken(response.session.access_token);
      }
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      logout();
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
