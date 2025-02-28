import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tghyjgtjqglnstfnxzeh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaHlqZ3RqcWdsbnN0Zm54emVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE0NjQyNzksImV4cCI6MjAyNzA0MDI3OX0.xkgPDLrn7PmjnvZX_Isp91bcnVpFEY7JkeQBojOkMR4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;