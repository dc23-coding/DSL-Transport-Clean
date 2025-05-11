import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import MiniMileageCalculator from '@/components/MiniMileageCalculator';

const DriverDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loads, setLoads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    completedLoads: 0,
    totalEarnings: 0,
    upcomingLoads: 0,
    complianceAlerts: []
  });

  useEffect(() => {
    fetchDriverData();
  }, [user.id]);

  const fetchDriverData = async () => {
    const { data: loadsData } = await supabase
      .from('loads')
      .select('*')
      .eq('driver_id', user.id)
      .order('pickup_time', { ascending: true });

    const { data: paymentsData } = await supabase
      .from('payroll')
      .select('*')
      .eq('driver_id', user.id)
      .order('payment_date', { ascending: false });

    if (loadsData) setLoads(loadsData);
    if (paymentsData) setPayments(paymentsData);

    setStats({
      completedLoads: loadsData?.filter(load => load.status === 'Completed').length || 0,
      totalEarnings: paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0,
      upcomingLoads: loadsData?.filter(load => load.status === 'Scheduled').length || 0,
      complianceAlerts: []
    });
  };

  const handleStatusUpdate = async (loadId, newStatus) => {
    const { error } = await supabase
      .from('loads')
      .update({ status: newStatus })
      .eq('id', loadId);

    if (error) {
      toast({ title: 'Error updating load status', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Load marked as ${newStatus}` });
      fetchDriverData();
    }
  };

  const chartData = payments.map(payment => ({
    date: new Date(payment.payment_date).toLocaleDateString(),
    amount: Number(payment.amount)
  }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Driver Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={<Truck />} title="Completed Loads" value={stats.completedLoads} color="text-blue-400" />
        <SummaryCard icon={<DollarSign />} title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} color="text-green-400" />
        <SummaryCard icon={<CheckCircle />} title="Upcoming Loads" value={stats.upcomingLoads} color="text-yellow-400" />
        <SummaryCard icon={<AlertTriangle />} title="Compliance Alerts" value={stats.complianceAlerts.length} color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart chartData={chartData} />
        <UpcomingLoadsPanel loads={loads} onStatusUpdate={handleStatusUpdate} />
      </div>

      {/* Mini Route Calculator */}
      <MiniMileageCalculator />
    </div>
  );
};

const SummaryCard = ({ icon, title, value, color }) => (
  <motion.div className="glass-effect p-4 rounded-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
    <div className="flex items-center gap-2">
      <div className={`h-5 w-5 ${color}`}>{icon}</div>
      <h3 className="font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);

const EarningsChart = ({ chartData }) => (
  <motion.div className="glass-effect p-4 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h3 className="text-xl font-bold mb-4">Earnings Trend</h3>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#4CAF50" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

const UpcomingLoadsPanel = ({ loads, onStatusUpdate }) => (
  <motion.div className="glass-effect p-4 rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h3 className="text-xl font-bold mb-4">Assigned Loads</h3>
    <div className="space-y-4">
      {loads.map(load => (
        <div key={load.id} className="gradient-border bg-card p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{load.origin} → {load.destination}</p>
              <p className="text-sm text-muted-foreground">
                Pickup: {new Date(load.pickup_time).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Status: {load.status}</p>
            </div>
            <div className="flex flex-col gap-2">
              {load.status === 'Scheduled' && (
                <Button variant="outline" size="sm" onClick={() => onStatusUpdate(load.id, 'In Progress')}>
                  Start Load
                </Button>
              )}
              {load.status === 'In Progress' && (
                <Button variant="outline" size="sm" onClick={() => onStatusUpdate(load.id, 'Completed')}>
                  Complete Load
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default DriverDashboard;
