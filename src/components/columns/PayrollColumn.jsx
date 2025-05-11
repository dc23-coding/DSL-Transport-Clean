import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Clock, FileText, MoreHorizontal, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PayrollForm from '@/components/forms/PayrollForm';

const PayrollColumn = () => {
  const [showPayrollForm, setShowPayrollForm] = useState(false);

  const payrollItems = [
    {
      id: 1,
      driver: "Michael Johnson",
      amount: "$2,450.75",
      period: "May 1-15, 2025",
      status: "Paid",
      statusColor: "bg-green-500",
      date: "May 16, 2025"
    },
    {
      id: 2,
      driver: "Sarah Williams",
      amount: "$1,875.30",
      period: "May 1-15, 2025",
      status: "Paid",
      statusColor: "bg-green-500",
      date: "May 16, 2025"
    },
    {
      id: 3,
      driver: "Robert Davis",
      amount: "$2,120.45",
      period: "May 1-15, 2025",
      status: "Processing",
      statusColor: "bg-yellow-500",
      date: "May 16, 2025"
    },
    {
      id: 4,
      driver: "Jennifer Miller",
      amount: "$2,310.60",
      period: "May 1-15, 2025",
      status: "Processing",
      statusColor: "bg-yellow-500",
      date: "May 16, 2025"
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
          <DollarSign className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold">Payroll</h2>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setShowPayrollForm(true)}>
          <Plus className="h-4 w-4" />
          <span>New Payment</span>
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">All Payments</Button>
          <Button variant="ghost" size="sm" className="text-xs">Processing</Button>
          <Button variant="ghost" size="sm" className="text-xs">Paid</Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          <Filter className="h-3 w-3" />
          <span className="text-xs">Filter</span>
        </Button>
      </div>

      {/* Payroll List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {payrollItems.map((item, i) => (
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
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{item.amount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span>Period: {item.period}</span>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2 gap-1">
                <FileText className="h-3 w-3" />
                <span>View Statement</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payroll Form Modal */}
      {showPayrollForm && (
        <PayrollForm
          onClose={() => setShowPayrollForm(false)}
          onSuccess={() => setShowPayrollForm(false)}
        />
      )}
    </div>
  );
};

export default PayrollColumn;
