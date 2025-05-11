import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setUserRole, setAdminMode } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = signInData.user;
      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const role = profile.role;
      setUserRole(role);

      toast({ title: "Login successful", description: `Welcome back, ${role}!` });

      // Redirect based on role
      switch (role) {
        case 'admin':
          setAdminMode(true);
          navigate('/');
          break;
        case 'driver':
          navigate('/driver-dashboard');
          break;
        case 'broker':
          navigate('/broker-dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = async () => {
    const email = 'admin@dsltransport.com';
    const password = 'AdminPass123'; // Replace with your secure admin password
  
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
  
      const user = signInData.user;
      setUser(user);
  
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
  
      if (profileError) throw profileError;
  
      const role = profile.role;
      setUserRole(role);
      setAdminMode(true);
  
      toast({ title: "Admin access granted", description: "Welcome to DSL Transport admin dashboard!" });
      navigate('/');
    } catch (err) {
      toast({ title: "Admin login failed", description: err.message, variant: "destructive" });
    }
  };
  

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="glass-effect rounded-lg p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <img src="/assets/dsl-logo.png" alt="DSL Transport Logo" className="h-16 w-auto mb-4" />
            <h2 className="text-2xl font-bold">Welcome to DSL Transport</h2>
            <p className="text-muted-foreground mt-2">Access your dashboard</p>
          </div>

          <div className="space-y-4">
            <Button onClick={handleAdminAccess} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900" size="lg">
              Admin Access
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or Login with Email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background" required />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background" required />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">Create one here</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
