
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Calendar, DollarSign, Users, Package, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DispatchingColumn from '@/components/columns/DispatchingColumn';
import LogisticsColumn from '@/components/columns/LogisticsColumn';
import PayrollColumn from '@/components/columns/PayrollColumn';

const Dashboard = () => {
  const [activeColumns, setActiveColumns] = useState([]);
  
  useEffect(() => {
    // Sequentially activate columns with a delay
    const timer1 = setTimeout(() => {
      setActiveColumns(prev => [...prev, 'dispatching']);
    }, 300);
    
    const timer2 = setTimeout(() => {
      setActiveColumns(prev => [...prev, 'logistics']);
    }, 600);
    
    const timer3 = setTimeout(() => {
      setActiveColumns(prev => [...prev, 'payroll']);
    }, 900);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const statsData = [
    { icon: <Truck className="h-5 w-5 text-blue-400" />, title: "Active Trucks", value: "24", change: "+2" },
    { icon: <Calendar className="h-5 w-5 text-green-400" />, title: "Scheduled Loads", value: "47", change: "+5" },
    { icon: <DollarSign className="h-5 w-5 text-yellow-400" />, title: "Revenue MTD", value: "$87,432", change: "+12%" },
    { icon: <Users className="h-5 w-5 text-purple-400" />, title: "Drivers", value: "32", change: "0" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your trucking operations.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="glass-effect rounded-lg p-4 shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-background/30 p-2">
                {stat.icon}
              </div>
              <div className="flex items-center text-sm">
                <span className={`mr-1 ${stat.change.startsWith('+') ? 'text-green-400' : stat.change === '0' ? 'text-gray-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
                <TrendingUp className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 column-container">
        {activeColumns.includes('dispatching') && (
          <motion.div 
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DispatchingColumn />
          </motion.div>
        )}
        
        {activeColumns.includes('logistics') && (
          <motion.div 
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LogisticsColumn />
          </motion.div>
        )}
        
        {activeColumns.includes('payroll') && (
          <motion.div 
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PayrollColumn />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
