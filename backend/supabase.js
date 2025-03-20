// backend/supabase.js
import { createClient } from "@supabase/supabase-js";

// Replace these values with your actual Supabase URL and anon key
const supabaseUrl = "https://xghlnrkpdghlcmwgqqbd.supabase.co";  // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaGxucmtwZGdobGNtd2dxcWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MzMxNzksImV4cCI6MjA1ODAwOTE3OX0.LoEJvHIgzFcjVibvKAzB0NS4Lb7PTL9fEh6ixGnHY3w";  // Replace with your Supabase anon key

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
