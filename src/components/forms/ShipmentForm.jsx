import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const ShipmentForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer: '',
    cargo_type: '',
    weight: '',
    origin: '',
    destination: '',
    status: 'Pending',
    load_id: '' // Optional association to existing load
  });
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLoads = async () => {
      const { data, error } = await supabase.from('loads').select('id, origin, destination');
      if (!error) setLoads(data);
    };
    fetchLoads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('shipments')
        .insert([formData])
        .select();

      if (error) throw error;

      toast({
        title: "Shipment created successfully",
        description: "The new shipment has been added to the system.",
      });

      onSuccess && onSuccess(data[0]);
      onClose();
    } catch (error) {
      toast({
        title: "Error creating shipment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <h2 className="text-xl font-bold">Create New Shipment</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cargo Type</label>
            <input
              type="text"
              value={formData.cargo_type}
              onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Origin</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Associate Existing Load (Optional)</label>
            <select
              value={formData.load_id}
              onChange={(e) => setFormData({ ...formData, load_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
            >
              <option value="">No Load Selected</option>
              {loads.map(load => (
                <option key={load.id} value={load.id}>
                  {load.origin} → {load.destination}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Shipment'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ShipmentForm;
