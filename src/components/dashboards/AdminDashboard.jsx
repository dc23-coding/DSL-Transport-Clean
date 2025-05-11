import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrokerPostedLoadsPanel from '@/components/panels/BrokerPostedLoadsPanel';
import FullPayrollPage from '@/components/pages/FullPayrollPage';
import AdminLoadStatusOverviewPanel from '@/components/panels/AdminLoadStatusOverviewPanel';
import AdminRealTimeLoadBoardPanel from '@/components/panels/AdminRealTimeLoadBoardPanel';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('overview');

  const renderSection = () => {
    switch (view) {
      case 'broker-posted-loads':
        return <BrokerPostedLoadsPanel />;
      case 'payroll':
        return <FullPayrollPage />;
      case 'load-status-overview':
        return <AdminLoadStatusOverviewPanel />;
      case 'real-time-load-board':
        return <AdminRealTimeLoadBoardPanel />;
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Overview</h1>
            <p className="text-muted-foreground">
              Use the buttons below to navigate to different sections of the admin workspace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/dashboard')}>Go to Admin Workspace</Button>
              <Button onClick={() => setView('broker-posted-loads')}>View Broker Posted Loads</Button>
              <Button onClick={() => setView('payroll')}>Manage Payroll</Button>
              <Button onClick={() => setView('load-status-overview')}>Load Status Overview</Button>
              <Button onClick={() => setView('real-time-load-board')}>Real-Time Load Board</Button>
            </div>
          </div>
        );
    }
  };

  return <div className="space-y-6">{renderSection()}</div>;
};

export default AdminDashboard;
