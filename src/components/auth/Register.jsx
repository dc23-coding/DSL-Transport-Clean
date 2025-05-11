import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Truck, Package, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_PASSWORD = 'AdminPass123'; // Development-only password

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser, setUserRole } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (!selectedRole) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }

    if (selectedRole === 'admin' && adminPassword !== ADMIN_PASSWORD) {
      toast({ title: "Invalid admin password", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = signUpData.user;
      setUser(user);

      const { error: roleInsertError } = await supabase
        .from('users')
        .insert([{ id: user.id, role: selectedRole }]);

      if (roleInsertError) throw roleInsertError;

      setUserRole(selectedRole);

      if (selectedRole === 'driver') {
        await supabase.from('drivers').insert([{ id: user.id, name: email.split('@')[0] }]);
      }

      toast({ title: "Registration successful", description: "Please check your email for verification." });

      navigate(selectedRole === 'driver' ? '/driver-dashboard' :
               selectedRole === 'broker' ? '/broker-dashboard' :
               '/');

    } catch (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const roleButtons = [
    { role: 'driver', icon: <Truck className="h-5 w-5" />, label: 'Register as Driver', description: 'For truck drivers and operators' },
    { role: 'broker', icon: <Package className="h-5 w-5" />, label: 'Register as Dispatcher', description: 'For logistics and dispatch staff' },
    { role: 'admin', icon: <Shield className="h-5 w-5" />, label: 'Register as Admin', description: 'For system administrators' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="glass-effect rounded-lg p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/981c1f7c-d49b-4a25-b84f-4712fb519dd3/6767e24e0e87af195e66f7aff138577e.png" alt="DSL Transport Logo" className="h-16 w-auto mb-4" />
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-muted-foreground mt-2">Join DSL Transport</p>
          </div>

          <div className="space-y-4 mb-6">
            {roleButtons.map(button => (
              <motion.button
                key={button.role}
                onClick={() => setSelectedRole(button.role)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedRole === button.role ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                } flex items-center gap-3`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={selectedRole === button.role ? 'text-primary' : 'text-muted-foreground'}>
                  {button.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium">{button.label}</p>
                  <p className="text-sm text-muted-foreground">{button.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background" required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background" required />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Confirm Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background" required />
            </div>

            {selectedRole === 'admin' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label htmlFor="adminPassword" className="block text-sm font-medium mb-2">Admin Password</label>
                <input type="password" id="adminPassword" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-3 py-2 rounded-md border bg-background" required />
              </motion.div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !selectedRole}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
