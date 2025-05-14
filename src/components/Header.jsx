// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, userRole } = useAuth();
  const { logout } = useLogout();

  return (
    <header className="flex justify-between items-center p-4 bg-card shadow-md">
      <Link to="/" className="text-xl font-bold">
        DSL Transport
      </Link>

      <nav className="flex items-center gap-4">
        {user ? (
          <div className="relative group">
            <Button variant="outline" className="relative">
              {user.email}
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-card border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to={
                  userRole === 'admin'
                    ? '/dashboard'
                    : userRole === 'driver'
                    ? '/driver-dashboard'
                    : '/broker-dashboard'
                }
                className="block px-4 py-2 hover:bg-accent w-full text-left"
              >
                My Dashboard
              </Link>
              <button
                onClick={logout}
                className="block px-4 py-2 hover:bg-accent w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
