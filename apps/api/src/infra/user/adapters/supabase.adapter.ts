import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "../config/supabase.config";

@Injectable()
export class SupabaseAdapter {
  private readonly client: SupabaseClient;

  public constructor() {
    this.client = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  public getAdminClient(): SupabaseClient {
    return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}
