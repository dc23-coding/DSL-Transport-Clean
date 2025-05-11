import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const AdminLoadStatusOverviewPanel = () => {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    fetchAllLoads();
  }, []);

  const fetchAllLoads = async () => {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .order('pickup_time', { ascending: true });

    if (error) {
      console.error('Error fetching loads:', error);
    } else {
      setLoads(data);
    }
  };

  const renderLoadsByStatus = (status) => (
    loads.filter(load => load.status === status).map((load, i) => (
      <motion.div
        key={load.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="gradient-border bg-card p-3 rounded-lg"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium">{load.origin} → {load.destination}</p>
            <p className="text-sm text-muted-foreground">
              Pickup: {new Date(load.pickup_time).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Driver ID: {load.driver_id || 'Unassigned'}
            </p>
            <p className="text-sm text-muted-foreground">
              Broker ID: {load.broker_id || 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    ))
  );

  return (
    <div className="glass-effect p-4 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-bold">Load Status Overview</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Scheduled Loads</h3>
        {renderLoadsByStatus('Scheduled')}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">In Progress Loads</h3>
        {renderLoadsByStatus('In Progress')}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Completed Loads</h3>
        {renderLoadsByStatus('Completed')}
      </div>
    </div>
  );
};

export default AdminLoadStatusOverviewPanel;
