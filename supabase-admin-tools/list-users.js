import { createClient } from '@supabase/supabase-js';

// Replace with your actual values
const SUPABASE_URL = 'https://xoeocjtdxfvfbnxbxznq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZW9janRkeGZ2ZmJueGJ4em5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgxNTE1MiwiZXhwIjoyMDYyMzkxMTUyfQ.l6PTXCa4h77RJEwcq0YRGGzX7mJjzdB5wE-Z7sZ9bPw';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function listAllUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('Error listing users:', error);
  } else {
    console.log('Registered Users:');
    data.users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} - ID: ${user.id}`);
    });
  }
}

listAllUsers();
