import { User, Session } from '@supabase/supabase-js';

export interface SupabaseAuthResponse {
  user: User | null;
  session: Session | null;
}

export interface ITokenService {
  signInWithPassword(email: string, password: string): Promise<SupabaseAuthResponse>;
  signUp(email: string, password: string, name?: string): Promise<SupabaseAuthResponse>;
  signOut(): Promise<void>;
  refreshSession(refreshToken: string): Promise<SupabaseAuthResponse>;
  verifyAccessToken(token: string): Promise<User>;
}

