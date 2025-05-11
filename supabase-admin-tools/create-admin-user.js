import { createClient } from '@supabase/supabase-js';

// Replace with your actual project values
const SUPABASE_URL = 'https://xoeocjtdxfvfbnxbxznq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZW9janRkeGZ2ZmJueGJ4em5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgxNTE1MiwiZXhwIjoyMDYyMzkxMTUyfQ.l6PTXCa4h77RJEwcq0YRGGzX7mJjzdB5wE-Z7sZ9bPw';


const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createAdminUser() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@dsltransport.com',
    password: 'AdminPass123',
    email_confirm: true, // <-- Forces email confirmation bypass
  });

  if (error) {
    console.error('Error creating admin user:', error.message);
  } else {
    console.log('Admin user created successfully:', data);
  }
}

createAdminUser();
