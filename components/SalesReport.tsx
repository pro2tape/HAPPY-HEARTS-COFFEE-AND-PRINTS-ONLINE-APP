import React, { useState, useEffect, useMemo } from 'react';
import { Order } from '../types';
import { DownloadIcon } from './Icons';

const SalesReport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const { daily, weekly, monthly, yearly } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    return orders.reduce(
      (acc, order) => {
        const orderDate = new Date(order.date);
        if (orderDate >= today) acc.daily += order.total;
        if (orderDate >= weekAgo) acc.weekly += order.total;
        if (orderDate >= monthStart) acc.monthly += order.total;
        if (orderDate >= yearStart) acc.yearly += order.total;
        return acc;
      },
      { daily: 0, weekly: 0, monthly: 0, yearly: 0 }
    );
  }, [orders]);

  const exportToCSV = () => {
    const headers = [
      'OrderID',
      'Date',
      'Time',
      'Item Name',
      'Size',
      'Quantity',
      'Item Price',
      'Row Total',
      'Order Subtotal',
      'Delivery Fee',
      'Order Total'
    ];
    
    const rows = orders.flatMap(order => 
      order.items.map(item => [
        order.id,
        new Date(order.date).toLocaleDateString(),
        new Date(order.date).toLocaleTimeString(),
        item.name.replace(/,/g, ''), // remove commas to avoid csv issues
        item.selectedSize?.name || 'N/A',
        item.quantity,
        item.selectedSize?.price || item.price,
        (item.selectedSize?.price || item.price) * item.quantity,
        order.subtotal,
        order.deliveryFee,
        order.total
      ].join(','))
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `happy-hearts-sales-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
   const handlePrintReport = () => {
    window.print();
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md print-section">
      <div className="flex flex-wrap justify-between items-center mb-6 non-printable">
        <h2 className="text-xl font-semibold text-gray-800">Sales Report</h2>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button onClick={handlePrintReport} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">Print Report</button>
          <button onClick={exportToCSV} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <DownloadIcon className="w-5 h-5" />
            Export to Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-800 font-semibold">Today's Sales</p>
            <p className="text-2xl font-bold text-blue-900">₱{daily.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg text-center">
            <p className="text-sm text-indigo-800 font-semibold">Weekly Sales</p>
            <p className="text-2xl font-bold text-indigo-900">₱{weekly.toFixed(2)}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-800 font-semibold">Monthly Sales</p>
            <p className="text-2xl font-bold text-purple-900">₱{monthly.toFixed(2)}</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-lg text-center">
            <p className="text-sm text-pink-800 font-semibold">Yearly Sales</p>
            <p className="text-2xl font-bold text-pink-900">₱{yearly.toFixed(2)}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Order History</h3>
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.slice().reverse().map(order => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₱{order.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-section, .print-section * {
              visibility: visible;
            }
            .print-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .non-printable {
              display: none;
            }
          }
        `}</style>
    </section>
  );
};

export default SalesReport;
