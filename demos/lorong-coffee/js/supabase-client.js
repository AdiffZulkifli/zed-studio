(function() {
  const supabaseUrl = 'https://dlzvfbdolcnxxeavuuan.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsenZmYmRvbGNueHhlYXZ1dWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIzODksImV4cCI6MjA5MjU2ODM4OX0.OYLIsUxoyADwO13JUh2SSynUmZzfm9rjQFTrXdofpPA';

  // Initialize the Supabase client and attach it directly to the window
  window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
})();
