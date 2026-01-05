
import { createClient } from '@supabase/supabase-js';

// Using the credentials provided by the user
const supabaseUrl = 'https://hwwnedjwpgduvesznhha.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3d25lZGp3cGdkdXZlc3puaGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MzAyODEsImV4cCI6MjA4MzIwNjI4MX0.voeZC0nPpCUVcoi8XL9sPkq9C47_mlqB27GpoPuD4MA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
