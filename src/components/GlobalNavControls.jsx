// src/components/GlobalNavControls.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLogout } from '@/hooks/useLogout';

const GlobalNavControls = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { logout } = useLogout();

  const handleBack = () => window.history.length > 1 && navigate(-1);
  const handleForward = () => navigate(1);
  const goToRouteCalculator = () => navigate('/route-calculator');

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
      <Button onClick={handleBack} variant="outline" size="sm" className="rounded-full">
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button onClick={goToRouteCalculator} variant="default" size="sm" className="rounded-full">
        <MapPin className="h-4 w-4" />
      </Button>

      {user && (
        <div className="relative group">
          <Button variant="outline" size="sm" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
          <div className="absolute right-0 bottom-10 w-48 bg-card border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() =>
                navigate(
                  userRole === 'admin'
                    ? '/dashboard'
                    : userRole === 'driver'
                    ? '/driver-dashboard'
                    : '/broker-dashboard'
                )
              }
              className="block px-4 py-2 hover:bg-accent w-full text-left"
            >
              My Dashboard
            </button>
            <button
              onClick={logout}
              className="block px-4 py-2 hover:bg-accent w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <Button onClick={handleForward} variant="outline" size="sm" className="rounded-full">
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default GlobalNavControls;
