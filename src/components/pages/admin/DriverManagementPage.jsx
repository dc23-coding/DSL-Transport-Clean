import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import DriverLoadsPanel from '@/components/panels/DriverLoadsPanel';
import DriverPayrollPanel from '@/components/panels/DriverPayrollPanel';

const DriverManagementPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [viewingLoadsDriver, setViewingLoadsDriver] = useState(null);
  const [viewingPayrollDriver, setViewingPayrollDriver] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase.from('drivers').select('*');
      if (!error) setDrivers(data);
    };
    fetchDrivers();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Driver Management</h1>
        <p className="text-muted-foreground mt-2">Manage all registered drivers and view their activities.</p>
      </motion.div>

      <div className="space-y-4">
        {drivers.map(driver => (
          <motion.div
            key={driver.id}
            className="glass-effect p-4 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{driver.name}</h2>
                <p className="text-sm text-muted-foreground">Driver ID: {driver.id}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewingLoadsDriver(driver)}>
                  View Loads
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewingPayrollDriver(driver)}>
                  View Payroll
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {viewingLoadsDriver && (
        <DriverLoadsPanel
          driver={viewingLoadsDriver}
          onClose={() => setViewingLoadsDriver(null)}
        />
      )}

      {viewingPayrollDriver && (
        <DriverPayrollPanel
          driver={viewingPayrollDriver}
          onClose={() => setViewingPayrollDriver(null)}
        />
      )}
    </div>
  );
};

export default DriverManagementPage;
