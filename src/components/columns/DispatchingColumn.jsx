import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Clock, Calendar, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadForm from '@/components/forms/LoadForm';

const DispatchingColumn = () => {
  const [showLoadForm, setShowLoadForm] = useState(false);

  const dispatchItems = [
    {
      id: 1,
      driver: "Michael Johnson",
      origin: "Chicago, IL",
      destination: "Indianapolis, IN",
      pickupTime: "09:30 AM",
      status: "In Transit",
      statusColor: "bg-blue-500"
    },
    {
      id: 2,
      driver: "Sarah Williams",
      origin: "Detroit, MI",
      destination: "Cleveland, OH",
      pickupTime: "11:00 AM",
      status: "Loading",
      statusColor: "bg-yellow-500"
    },
    {
      id: 3,
      driver: "Robert Davis",
      origin: "Columbus, OH",
      destination: "Pittsburgh, PA",
      pickupTime: "01:15 PM",
      status: "Scheduled",
      statusColor: "bg-purple-500"
    },
    {
      id: 4,
      driver: "Jennifer Miller",
      origin: "Cincinnati, OH",
      destination: "Louisville, KY",
      pickupTime: "02:45 PM",
      status: "Scheduled",
      statusColor: "bg-purple-500"
    }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <div className="h-full flex flex-col glass-effect rounded-lg p-4 shadow-lg">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Dispatching</h2>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setShowLoadForm(true)}>
          <Plus className="h-4 w-4" />
          <span>New Load</span>
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" className="text-xs">All Loads</Button>
        <Button variant="ghost" size="sm" className="text-xs">In Transit</Button>
        <Button variant="ghost" size="sm" className="text-xs">Scheduled</Button>
        <Button variant="ghost" size="sm" className="text-xs">Completed</Button>
      </div>

      {/* Load List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {dispatchItems.map((item, i) => (
          <motion.div
            key={item.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="gradient-border bg-card p-3 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{item.driver}</h3>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${item.statusColor}`} />
                <span className="text-xs text-muted-foreground">{item.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{item.origin}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{item.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>{item.pickupTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Today</span>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                View Details
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load Form Modal */}
      {showLoadForm && (
        <LoadForm
          onClose={() => setShowLoadForm(false)}
          onSuccess={() => setShowLoadForm(false)}
        />
      )}
    </div>
  );
};

export default DispatchingColumn;
