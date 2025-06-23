import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      secrets: {
        Row: {
          id: string;
          user_id: string | null;
          content: string;
          password_hash: string | null;
          expires_at: string | null;
          one_time_access: boolean;
          viewed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          content: string;
          password_hash?: string | null;
          expires_at?: string | null;
          one_time_access?: boolean;
          viewed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          content?: string;
          password_hash?: string | null;
          expires_at?: string | null;
          one_time_access?: boolean;
          viewed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};