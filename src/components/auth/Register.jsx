// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (!role) {
      toast({ title: 'Please select a role', variant: 'destructive' });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });

    setLoading(false);

    if (error) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created successfully. Please log in.' });
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg space-y-4">
      <h1 className="text-2xl font-bold mb-2">Create Account</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border rounded-md bg-background"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded-md bg-background"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded-md bg-background"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-3 py-2 border rounded-md bg-background"
        required
      >
        <option value="">Select Role</option>
        <option value="driver">Driver</option>
        <option value="broker">Broker</option>
      </select>

      <Button onClick={handleRegister} disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Register'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <a href="/login" className="underline">Login here</a>
      </p>
    </div>
  );
};

export default Register;
