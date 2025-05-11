import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2, RefreshCw } from 'lucide-react';

const AdminRealTimeLoadBoardPanel = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoads();

    const subscription = supabase
      .channel('public:loads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loads' }, () => {
        fetchLoads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchLoads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .order('pickup_time', { ascending: true });

    if (error) {
      console.error('Error fetching loads:', error);
    } else {
      setLoads(data);
    }
    setLoading(false);
  };

  return (
    <div className="glass-effect p-4 rounded-lg shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Real-Time Load Board</h2>
        <Button variant="outline" size="sm" onClick={fetchLoads} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          {loading ? 'Loading...' : 'Manual Refresh'}
        </Button>
      </div>

      {loads.length === 0 ? (
        <p className="text-muted-foreground">No loads available.</p>
      ) : (
        loads.map((load, i) => (
          <motion.div
            key={load.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gradient-border bg-card p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{load.origin} → {load.destination}</p>
              <p className="text-sm text-muted-foreground">
                Pickup: {new Date(load.pickup_time).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {load.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Driver ID: {load.driver_id || 'Unassigned'}
              </p>
              <p className="text-sm text-muted-foreground">
                Broker ID: {load.broker_id || 'N/A'}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AdminRealTimeLoadBoardPanel;
