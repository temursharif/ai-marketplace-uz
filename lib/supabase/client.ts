// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// .env.local dan kalitlarni oladi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Brauzer (Client Side) uchun ulanishni yaratamiz
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)