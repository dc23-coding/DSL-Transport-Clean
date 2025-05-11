import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import AssignDriverModal from '@/components/forms/AssignDriverModal';

const BrokerPostedLoadsPanel = () => {
  const [brokerLoads, setBrokerLoads] = useState([]);
  const [selectedLoadId, setSelectedLoadId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBrokerLoads();
  }, []);

  const fetchBrokerLoads = async () => {
    const { data, error } = await supabase
      .from('loads')
      .select('*')
      .is('driver_id', null)
      .not('broker_id', 'is', null)
      .order('pickup_time', { ascending: true });

    if (error) {
      console.error('Error fetching broker loads:', error);
    } else {
      setBrokerLoads(data);
    }
  };

  const handleDriverAssigned = () => {
    fetchBrokerLoads();
    setSelectedLoadId(null);
  };

  return (
    <div className="glass-effect p-4 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold mb-4">Broker Posted Loads</h2>

      {brokerLoads.length === 0 ? (
        <p className="text-muted-foreground">No broker posted loads available.</p>
      ) : (
        brokerLoads.map((load, i) => (
          <motion.div
            key={load.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gradient-border bg-card p-3 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{load.origin} → {load.destination}</p>
                <p className="text-sm text-muted-foreground">
                  Pickup: {new Date(load.pickup_time).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Broker ID: {load.broker_id}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedLoadId(load.id)}
              >
                Assign Driver
              </Button>
            </div>
          </motion.div>
        ))
      )}

      {selectedLoadId && (
        <AssignDriverModal
          loadId={selectedLoadId}
          onClose={() => setSelectedLoadId(null)}
          onAssigned={handleDriverAssigned}
        />
      )}
    </div>
  );
};

export default BrokerPostedLoadsPanel;
