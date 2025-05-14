// src/router/index.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import Dashboard from '@/components/Dashboard';
import DriverDashboard from '@/components/dashboards/DriverDashboard';
import BrokerDashboard from '@/components/dashboards/BrokerDashboard';
import FullPayrollPage from '@/components/pages/FullPayrollPage';
import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import RouteCalculatorPage from '@/components/pages/RouteCalculatorPage';

// Public Routes (No App wrapper required)
const publicRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
];

// Protected Routes (Require App wrapper with <Outlet />)
const protectedRoutes = {
  path: '/',
  element: <App />,
  children: [
    { path: '/', element: <AdminDashboard /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/driver-dashboard', element: <DriverDashboard /> },
    { path: '/broker-dashboard', element: <BrokerDashboard /> },
    { path: '/payroll', element: <FullPayrollPage /> },
    { path: '/route-calculator', element: <RouteCalculatorPage /> },
  ],
};

export const router = createBrowserRouter([
  ...publicRoutes,
  protectedRoutes,
]);
