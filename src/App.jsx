import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AdminDashboard from '@/components/dashboards/AdminDashboard';  // Admin Overview
import Dashboard from '@/components/Dashboard';                     // Admin Workspace
import DriverDashboard from '@/components/dashboards/DriverDashboard';
import BrokerDashboard from '@/components/dashboards/BrokerDashboard';
import FullPayrollPage from '@/components/pages/FullPayrollPage';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import GlobalNavControls from '@/components/GlobalNavControls';


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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              {/* Admin Overview as Default Landing Page */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Workspace */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Role-Specific Dashboards */}
              <Route 
                path="/driver-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/broker-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['broker']}>
                    <BrokerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin-Only Pages */}
              <Route 
                path="/payroll" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <FullPayrollPage />
                  </ProtectedRoute>
                } 
              />

              {/* Authentication Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Toaster />
          <GlobalNavControls />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
