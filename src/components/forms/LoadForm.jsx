import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LoadForm = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [driverId, setDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase.from('drivers').select('id, name');
      if (error) {
        console.error('Error fetching drivers:', error);
      } else {
        setDrivers(data);
      }
    };
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('loads').insert([{
      origin,
      destination,
      pickup_time: pickupTime,
      driver_id: driverId,
      status: 'Scheduled'
    }]);

    setLoading(false);

    if (error) {
      toast({ title: 'Failed to create load', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Load created successfully' });
      onSuccess && onSuccess();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-2">Create New Load</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Origin</label>
          <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
        </div>

        <div>
          <label className="block mb-1">Destination</label>
          <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
        </div>

        <div>
          <label className="block mb-1">Pickup Time</label>
          <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
        </div>

        <div>
          <label className="block mb-1">Assign Driver</label>
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="w-full px-3 py-2 border rounded-md" required>
            <option value="">Select a Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Load'}</Button>
        </div>
      </form>
    </div>
  );
};

export default LoadForm;
