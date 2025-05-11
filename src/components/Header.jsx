import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, User, Truck, Package, DollarSign } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminMode, setAdminMode, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setAdminMode(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/';
      case 'driver':
        return '/driver-dashboard';
      case 'broker':
        return '/broker-dashboard';
      default:
        return '/login';
    }
  };

  const menuItems = [
    { path: '/', icon: <User className="h-5 w-5" />, label: 'Admin Overview' },
    { path: '/driver-dashboard', icon: <Truck className="h-5 w-5" />, label: 'Driver View' },
    { path: '/broker-dashboard', icon: <Package className="h-5 w-5" />, label: 'Broker View' },
    { path: '/payroll', icon: <DollarSign className="h-5 w-5" />, label: 'Payroll' },
  ];

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(getDashboardPath())}
              className="flex items-center gap-2"
            >
              <img 
                src="/assets/dsl-logo.png"
                alt="DSL Transport Logo"
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl">DSL Transport</span>
            </button>
          </div>

          {adminMode && (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <nav className="hidden md:flex items-center gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isMenuOpen && adminMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2 mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
