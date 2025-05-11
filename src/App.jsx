
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import DriverDashboard from '@/components/dashboards/DriverDashboard';
import BrokerDashboard from '@/components/dashboards/BrokerDashboard';
import FullPayrollPage from '@/components/pages/FullPayrollPage';
import RouteCalculatorPage from '@/components/pages/RouteCalculatorPage';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole) && userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

const DashboardRouter = () => {
  const { userRole } = useAuth();

  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'driver':
      return <DriverDashboard />;
    case 'broker':
      return <BrokerDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              {/* Admin can access all dashboards */}
              {isAdmin && (
                <>
                  <Route 
                    path="/driver-dashboard" 
                    element={
                      <ProtectedRoute>
                        <DriverDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/broker-dashboard" 
                    element={
                      <ProtectedRoute>
                        <BrokerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </>
              )}
              <Route 
                path="/payroll" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <FullPayrollPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard-overview" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
              <Route path="/route-calculator" element={<ProtectedRoute><RouteCalculatorPage /></ProtectedRoute>} />
              <Route path="/driver-dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
              <Route path="/broker-dashboard" element={<ProtectedRoute><BrokerDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
