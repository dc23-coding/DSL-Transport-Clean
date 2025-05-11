
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FullPayrollPage = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPayrollData();
  }, [dateRange]);

  const fetchPayrollData = async () => {
    try {
      const { data: payroll, error } = await supabase
        .from('payroll')
        .select(`
          *,
          drivers (
            name
          )
        `)
        .gte('period_start', dateRange.start)
        .lte('period_end', dateRange.end)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayrollData(payroll);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.autoTable({
      head: [['Driver', 'Period', 'Amount', 'Status', 'Payment Date']],
      body: payrollData.map(payment => [
        payment.drivers?.name || 'Unknown',
        `${new Date(payment.period_start).toLocaleDateString()} - ${new Date(payment.period_end).toLocaleDateString()}`,
        `$${payment.amount.toFixed(2)}`,
        payment.status,
        new Date(payment.payment_date).toLocaleDateString()
      ]),
    });

    doc.save('payroll-report.pdf');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Driver', 'Period Start', 'Period End', 'Amount', 'Status', 'Payment Date'],
      ...payrollData.map(payment => [
        payment.drivers?.name || 'Unknown',
        payment.period_start,
        payment.period_end,
        payment.amount,
        payment.status,
        payment.payment_date
      ])
    ]
    .map(row => row.join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'payroll-report.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground mt-2">Manage and track all payroll activities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={exportToPDF} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </motion.div>

      <div className="glass-effect p-4 rounded-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 rounded-md border bg-background"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 rounded-md border bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="px-3 py-2 rounded-md border bg-background"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Driver</th>
                <th className="text-left py-3 px-4">Period</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Payment Date</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading...</td>
                </tr>
              ) : payrollData.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-border"
                >
                  <td className="py-3 px-4">{payment.drivers?.name || 'Unknown'}</td>
                  <td className="py-3 px-4">
                    {new Date(payment.period_start).toLocaleDateString()} - 
                    {new Date(payment.period_end).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">${payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'Paid' ? 'bg-green-500/20 text-green-500' :
                      payment.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FullPayrollPage;
