import { createClient } from "@supabase/supabase-js";
import config from "../AppConfig";

export const supabase = createClient(
  config.supabaseConfig.supabaseUrl,
  config.supabaseConfig.supabaseAnonKey
);
