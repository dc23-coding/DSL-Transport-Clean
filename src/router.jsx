// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import Login from '@/components/auth/Login';  // Updated path
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
  },
  // Add other routes...
], {
  future: {
    v7_relativeSplatPath: true,
  },
});