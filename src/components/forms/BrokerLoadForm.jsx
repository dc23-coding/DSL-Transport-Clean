import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const BrokerLoadForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    pickup_time: '',
    delivery_time: '',
    status: 'Available', // Broker posted loads default to Available
    broker_id: user?.id || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('loads')
        .insert([formData])
        .select();

      if (error) throw error;

      toast({
        title: 'Load posted successfully',
        description: 'Your load has been added to the system.',
      });

      onSuccess && onSuccess(data[0]);
      onClose();
    } catch (error) {
      toast({
        title: 'Error posting load',
        description: error.message,
        variant: 'destructive',
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
          <h2 className="text-xl font-bold">Post New Load</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1">Pickup Time</label>
            <input
              type="datetime-local"
              value={formData.pickup_time}
              onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Delivery Time</label>
            <input
              type="datetime-local"
              value={formData.delivery_time}
              onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
              className="w-full px-3 py-2 rounded-md border bg-background"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Load'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BrokerLoadForm;
