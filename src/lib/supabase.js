import { createClient } from '@supabase/supabase-js';

// ── Supabase Configuration ────────────────────────────────────────────────────
// Project: Bob not found (Bob-a-thon hackathon)
const SUPABASE_URL     = 'https://hrlgpzagtahuvsqzdnxn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhybGdwemFndGFodXZzcXpkbnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDYxMDEsImV4cCI6MjA5NDc4MjEwMX0.9Dtjlw5JZBoWyzvHGGq4CABKpJGuuIRfLkZdNOLlTyQ';
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
