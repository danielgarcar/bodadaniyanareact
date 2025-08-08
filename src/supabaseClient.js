import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuqfiwtcoeeutnnjslty.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cWZpd3Rjb2VldXRubmpzbHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzgxNzcsImV4cCI6MjA2OTAxNDE3N30.l1o9WEUBSit38mvKV6THlBVlVVaCgXr4erSeP9LNi80';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
