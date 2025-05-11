import React, { useState, useEffect } from 'react';
import BrokerLoadForm from '@/components/forms/BrokerLoadForm';
import { motion } from 'framer-motion';
import { Package, DollarSign, TrendingUp, Mail, Wrench, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import DashboardWidgets from '@/components/widgets/DashboardWidgets';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BrokerDashboard = () => {
  const { user, userRole } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    const fetchBrokerData = async () => {
      let shipmentQuery = supabase.from('shipments').select('*').order('created_at', { ascending: false });
      if (userRole !== 'admin') shipmentQuery = shipmentQuery.eq('broker_id', user.id);
      const { data: shipmentsData } = await shipmentQuery;

      if (shipmentsData) {
        setShipments(shipmentsData);
        const totalRevenue = shipmentsData.length * 1000;
        const activeShipments = shipmentsData.filter(s => s.status === 'In Transit').length;

        setStats({
          totalShipments: shipmentsData.length,
          activeShipments,
          totalRevenue,
          monthlyGrowth: 12
        });
      }
    };

    fetchBrokerData();
  }, [user.id, userRole]);

  const revenueData = shipments.map((_, i) => ({
    month: `Month ${i + 1}`,
    revenue: 1000 * (i + 1)
  }));

  const handleStatusUpdate = async (shipmentId, newStatus) => {
    const { error } = await supabase
      .from('shipments')
      .update({ status: newStatus })
      .eq('id', shipmentId);

    if (!error) {
      setShipments(shipments.map(s => (s.id === shipmentId ? { ...s, status: newStatus } : s)));
      setSelectedShipment({ ...selectedShipment, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Broker Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage shipments and track business performance.</p>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-4">
        <Button variant={activeView === 'dashboard' ? 'default' : 'outline'} onClick={() => setActiveView('dashboard')}>
          Dashboard
        </Button>
        <Button onClick={() => setShowLoadForm(true)} className="mb-4">
           Post New Load
        </Button>
        <Button variant={activeView === 'shipments' ? 'default' : 'outline'} onClick={() => setActiveView('shipments')}>
          <Package className="h-4 w-4 mr-1" /> My Shipments
        </Button>
        <Button variant={activeView === 'revenue' ? 'default' : 'outline'} onClick={() => setActiveView('revenue')}>
          <DollarSign className="h-4 w-4 mr-1" /> Revenue Reports
        </Button>
        <Button variant={activeView === 'messages' ? 'default' : 'outline'} onClick={() => setActiveView('messages')}>
          <Mail className="h-4 w-4 mr-1" /> Messages
        </Button>
        <Button variant="outline" disabled>
          <Wrench className="h-4 w-4 mr-1" /> Dolo Tools (Coming Soon)
        </Button>
      </div>

      {/* Conditional Views */}
      {activeView === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Package />} label="Total Shipments" value={stats.totalShipments} />
          <StatCard icon={<DollarSign />} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} />
          <StatCard icon={<TrendingUp />} label="Active Shipments" value={stats.activeShipments} />
          <StatCard icon={<TrendingUp />} label="Monthly Growth" value={`+${stats.monthlyGrowth}%`} />
        </div>
      )}

      {activeView === 'shipments' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">My Shipments</h3>
          {shipments.map(shipment => (
            <div key={shipment.id} className="gradient-border bg-card p-3 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{shipment.customer}</p>
                <p className="text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedShipment(shipment)}>
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      {activeView === 'revenue' && (
        <div className="glass-effect p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4CAF50" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeView === 'messages' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Messages (Coming Soon)</h3>
          <p>No new messages.</p>
        </div>
      )}

      {selectedShipment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Shipment Details</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedShipment(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mb-4">
              <p><strong>Customer:</strong> {selectedShipment.customer}</p>
              <p><strong>Origin:</strong> {selectedShipment.origin}</p>
              <p><strong>Destination:</strong> {selectedShipment.destination}</p>
              <p><strong>Cargo:</strong> {selectedShipment.cargo_type}</p>
              <p><strong>Weight:</strong> {selectedShipment.weight} lbs</p>
              <p><strong>Status:</strong> {selectedShipment.status}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleStatusUpdate(selectedShipment.id, 'In Transit')}>
                Mark In Transit
              </Button>
              <Button variant="outline" onClick={() => handleStatusUpdate(selectedShipment.id, 'Completed')}>
                Mark Completed
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <motion.div className="glass-effect p-4 rounded-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="font-medium">{label}</h3>
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);

export default BrokerDashboard;
