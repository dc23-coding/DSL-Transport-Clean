import { createClient } from '@supabase/supabase-js';

// Replace with your actual project values
const SUPABASE_URL = 'https://xoeocjtdxfvfbnxbxznq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZW9janRkeGZ2ZmJueGJ4em5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgxNTE1MiwiZXhwIjoyMDYyMzkxMTUyfQ.l6PTXCa4h77RJEwcq0YRGGzX7mJjzdB5wE-Z7sZ9bPw';


const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function resetPassword(userId) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: 'AdminPass123', // New forced password
  });

  if (error) {
    console.error('Error updating user password:', error.message);
  } else {
    console.log('Password updated successfully:', data);
  }
}

// Replace with the correct user ID from list-users.js output
resetPassword('0e6d1706-0966-4d90-ad9a-f435d34c2952');