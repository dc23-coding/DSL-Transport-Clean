import React from 'react';
import { Truck, CalendarDays, DollarSign, CloudSun } from 'lucide-react';

const DashboardWidgets = ({ userRole }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <WidgetCard icon={<Truck />} label="Scheduled Loads" value="5" />
      <WidgetCard icon={<CalendarDays />} label="Calendar" value="2 Events" />
      <WidgetCard icon={<DollarSign />} label="Payments" value="$1,500" />
      <WidgetCard
        icon={<CloudSun />}
        label="Weather"
        value={userRole === 'driver' || userRole === 'broker' ? 'Upgrade to Dolo' : 'API Coming Soon'}
      />
    </div>
  );
};

const WidgetCard = ({ icon, label, value }) => (
  <div className="glass-effect p-4 rounded-lg flex flex-col items-start justify-between h-full">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="text-sm font-medium">{label}</h3>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default DashboardWidgets;
