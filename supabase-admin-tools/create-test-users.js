import { createClient } from '@supabase/supabase-js';

// Replace with your real project URL and Service Role Key
const SUPABASE_URL = 'https://xoeocjtdxfvfbnxbxznq.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZW9janRkeGZ2ZmJueGJ4em5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgxNTE1MiwiZXhwIjoyMDYyMzkxMTUyfQ.l6PTXCa4h77RJEwcq0YRGGzX7mJjzdB5wE-Z7sZ9bPw';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createUser(email, password, role) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error(`Error creating ${role} (${email}):`, error.message);
    return;
  }

  console.log(`${role} user created:`, data);

  const userId = data.user.id;

  const { error: roleInsertError } = await supabaseAdmin
    .from('users')
    .insert([{ id: userId, role }]);

  if (roleInsertError) {
    console.error(`Error assigning role to ${email}:`, roleInsertError.message);
  } else {
    console.log(`Role "${role}" assigned to ${email}`);
  }
}

async function createTestUsers() {
  await createUser('driver@dsltransport.com', 'DriverPass123', 'driver');
  await createUser('broker@dsltransport.com', 'BrokerPass123', 'broker');
}

createTestUsers();
