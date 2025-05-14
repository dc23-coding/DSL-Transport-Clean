// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (roleOverride = null) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } else {
      const targetRoute = roleOverride === 'admin' ? '/dashboard' : '/';
      navigate(targetRoute);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg space-y-4">
      <h1 className="text-2xl font-bold mb-2">Login</h1>

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

      <Button onClick={() => handleLogin()} disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account? <a href="/register" className="underline">Register here</a>
      </p>

      {/* Admin Access Button */}
      <Button
        onClick={() => handleLogin('admin')}
        variant="destructive"
        className="w-full mt-2"
      >
        Admin Access
      </Button>
    </div>
  );
};

export default Login;
