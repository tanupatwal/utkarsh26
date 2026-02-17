/**
 * supabaseClient.ts — Singleton Supabase client for anonymous read-only access.
 *
 * Used by TanStack Query hooks to fetch Events, Team, and Highlights data.
 * No session persistence — this is a public marketing site.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — ' +
        'falling back to hardcoded data.'
    );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    })
    : null;
