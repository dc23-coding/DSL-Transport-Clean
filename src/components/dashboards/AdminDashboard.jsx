import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import BrokerPostedLoadsPanel from '@/components/panels/BrokerPostedLoadsPanel';
import FullPayrollPage from '@/components/pages/FullPayrollPage';
import AdminLoadStatusOverviewPanel from '@/components/panels/AdminLoadStatusOverviewPanel';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [view, setView] = useState('dashboard');

  const renderSection = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'broker-posted-loads':
        return <BrokerPostedLoadsPanel />;
      case 'payroll':
        return <FullPayrollPage />;
      case 'load-status-overview':
        return <AdminLoadStatusOverviewPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4 flex-wrap">
        <Button
          variant={view === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setView('dashboard')}
        >
          Overview
        </Button>
        <Button
          variant={view === 'broker-posted-loads' ? 'default' : 'outline'}
          onClick={() => setView('broker-posted-loads')}
        >
          Broker Posted Loads
        </Button>
        <Button
          variant={view === 'payroll' ? 'default' : 'outline'}
          onClick={() => setView('payroll')}
        >
          Payroll Management
        </Button>
        <Button
          variant={view === 'load-status-overview' ? 'default' : 'outline'}
          onClick={() => setView('load-status-overview')}
        >
          Load Status Overview
        </Button>
      </div>

      {renderSection()}
    </div>
  );
};

export default AdminDashboard;
