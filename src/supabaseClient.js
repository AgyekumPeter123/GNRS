import { createClient } from '@supabase/supabase-js';

const supabaseUrl ='https://jjeyymyvtqeenyvakbqg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZXl5bXl2dHFlZW55dmFrYnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NDU5MjQsImV4cCI6MjA3ODMyMTkyNH0.vA9LFWVQvmzS8XIad0UG-YoVRxFSpzPksa8LCNJL8Gs';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);