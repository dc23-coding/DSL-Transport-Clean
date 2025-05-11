import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const AssignDriverModal = ({ loadId, onClose, onAssigned }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const { data, error } = await supabase.from('drivers').select('*');
    if (error) {
      console.error('Error fetching drivers:', error);
    } else {
      setDrivers(data);
    }
  };

  const handleAssign = async () => {
    if (!selectedDriverId) {
      toast({ title: 'Please select a driver', variant: 'destructive' });
      return;
    }

    const { error } = await supabase
      .from('loads')
      .update({ driver_id: selectedDriverId, status: 'Scheduled' })
      .eq('id', loadId);

    if (error) {
      toast({ title: 'Error assigning driver', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Driver assigned successfully' });
      onAssigned();
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Driver</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <select
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
          className="w-full px-3 py-2 rounded-md border bg-background mb-4"
        >
          <option value="">Select Driver</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAssign}>Assign Driver</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignDriverModal;
