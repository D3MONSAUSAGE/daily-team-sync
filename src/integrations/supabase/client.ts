
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zlfpiovyodiyecdueiig.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZnBpb3Z5b2RpeWVjZHVlaWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NzA0OTEsImV4cCI6MjA2MDM0NjQ5MX0.GAY6GgcApuuuH9MBXaThy-nW4UciDq2t6iSo6mMGiF4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});
