import { Injectable } from "@nestjs/common";
import { SupabaseClient, User, Session } from "@supabase/supabase-js";
import { TokenService } from "../../../application/user/interfaces/token.interface";
import { SupabaseAdapter } from "./supabase.adapter";
import {
  EmailNotConfirmedException,
  InvalidCredentialsException,
  UserNotFoundException,
  UserAlreadyExistsException,
  TokenExpiredException,
  InvalidTokenException,
  AuthServiceException,
} from "../../../domain/exceptions";

@Injectable()
export class SupabaseTokenAdapter implements TokenService {
  public constructor(private readonly supabaseService: SupabaseAdapter) {}

  private getClient(): SupabaseClient {
    return this.supabaseService.getClient();
  }

  public async signInWithPassword(
    email: string,
    password: string,
  ): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.getClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.handleSupabaseAuthError(error, email);
    }

    return data;
  }

  public async signUp(
    email: string,
    password: string,
  ): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.getClient().auth.signUp({
      email,
      password,
    });

    if (error) {
      this.handleSupabaseAuthError(error, email);
    }

    return data;
  }

  public async signOut(): Promise<void> {
    const { error } = await this.getClient().auth.signOut();
    if (error) {
      throw new AuthServiceException("Erro ao fazer logout", error);
    }
  }

  public async refreshSession(
    refreshToken: string,
  ): Promise<{ user: User | null; session: Session | null }> {
    const { data, error } = await this.getClient().auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      if (
        error.message.includes("refresh_token_not_found") ||
        error.message.includes("invalid_grant")
      ) {
        throw new TokenExpiredException();
      }
      throw new AuthServiceException("Erro ao renovar sessão", error);
    }

    return data;
  }

  public async verifyAccessToken(token: string): Promise<User> {
    const {
      data: { user },
      error,
    } = await this.getClient().auth.getUser(token);

    if (error) {
      if (
        error.message.includes("expired") ||
        error.message.includes("invalid")
      ) {
        throw new InvalidTokenException();
      }
      throw new AuthServiceException("Erro ao verificar token", error);
    }

    if (!user) {
      throw new InvalidTokenException();
    }

    return user;
  }

  private handleSupabaseAuthError(error: any, email: string): never {
    const errorMessage = error.message?.toLowerCase() || "";
    const errorCode = error.code || "";

    if (
      errorMessage.includes("email not confirmed") ||
      errorCode === "email_not_confirmed"
    ) {
      throw new EmailNotConfirmedException(email);
    }

    if (
      errorMessage.includes("invalid login credentials") ||
      errorMessage.includes("invalid credentials") ||
      errorCode === "invalid_credentials"
    ) {
      throw new InvalidCredentialsException();
    }

    if (
      errorMessage.includes("user not found") ||
      errorCode === "user_not_found"
    ) {
      throw new UserNotFoundException(email);
    }

    if (
      errorMessage.includes("user already registered") ||
      errorMessage.includes("already registered") ||
      errorCode === "user_already_registered"
    ) {
      throw new UserAlreadyExistsException(email);
    }

    if (errorMessage.includes("token") && errorMessage.includes("expired")) {
      throw new TokenExpiredException();
    }

    if (errorMessage.includes("token") && errorMessage.includes("invalid")) {
      throw new InvalidTokenException();
    }

    throw new AuthServiceException(error.message, error);
  }
}
