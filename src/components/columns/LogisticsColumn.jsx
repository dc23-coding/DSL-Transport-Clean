import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Truck, Calendar, MoreHorizontal, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShipmentForm from '@/components/forms/ShipmentForm';

const LogisticsColumn = () => {
  const [showShipmentForm, setShowShipmentForm] = useState(false);

  const logisticsItems = [
    {
      id: 1,
      customer: "ABC Manufacturing",
      cargo: "Industrial Equipment",
      weight: "12,500 lbs",
      origin: "Detroit, MI",
      destination: "Columbus, OH",
      status: "In Transit",
      statusColor: "bg-blue-500"
    },
    {
      id: 2,
      customer: "XYZ Distribution",
      cargo: "Consumer Goods",
      weight: "8,200 lbs",
      origin: "Chicago, IL",
      destination: "St. Louis, MO",
      status: "Pending",
      statusColor: "bg-yellow-500"
    },
    {
      id: 3,
      customer: "Global Foods Inc.",
      cargo: "Refrigerated Food",
      weight: "15,800 lbs",
      origin: "Indianapolis, IN",
      destination: "Nashville, TN",
      status: "Scheduled",
      statusColor: "bg-purple-500"
    },
    {
      id: 4,
      customer: "Tech Solutions Ltd.",
      cargo: "Electronics",
      weight: "5,400 lbs",
      origin: "Cincinnati, OH",
      destination: "Pittsburgh, PA",
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
          <Package className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-bold">Logistics</h2>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setShowShipmentForm(true)}>
          <Plus className="h-4 w-4" />
          <span>New Shipment</span>
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">All Shipments</Button>
          <Button variant="ghost" size="sm" className="text-xs">Active</Button>
          <Button variant="ghost" size="sm" className="text-xs">Scheduled</Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          <Filter className="h-3 w-3" />
          <span className="text-xs">Filter</span>
        </Button>
      </div>

      {/* Shipment List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {logisticsItems.map((item, i) => (
          <motion.div
            key={item.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="gradient-border bg-card p-3 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{item.customer}</h3>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${item.statusColor}`} />
                <span className="text-xs text-muted-foreground">{item.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{item.cargo}</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3 text-muted-foreground" />
                <span>{item.weight}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{item.origin}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{item.destination}</span>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                Track Shipment
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shipment Form Modal */}
      {showShipmentForm && (
        <ShipmentForm
          onClose={() => setShowShipmentForm(false)}
          onSuccess={() => setShowShipmentForm(false)}
        />
      )}
    </div>
  );
};

export default LogisticsColumn;
