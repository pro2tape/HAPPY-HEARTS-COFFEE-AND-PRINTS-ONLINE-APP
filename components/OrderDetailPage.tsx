import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { PrintIcon } from './Icons';

const OrderDetailPage: React.FC = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const hash = window.location.hash;
        const orderId = hash.split('/')[2];

        if (!orderId) {
            setError('No Order ID provided.');
            return;
        }

        const allOrdersRaw = localStorage.getItem('orders');
        if (allOrdersRaw) {
            const allOrders: Order[] = JSON.parse(allOrdersRaw);
            const foundOrder = allOrders.find(o => o.id === orderId);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setError(`Order with ID #${orderId} not found.`);
            }
        } else {
            setError('No orders found in storage.');
        }
    }, []);
    
    const handlePrint = () => {
        window.print();
    };

    if (error) {
        return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
    }

    if (!order) {
        return <div className="p-8 text-center text-gray-500 font-bold">Loading order...</div>;
    }

    return (
        <div className="bg-white min-h-screen font-mono">
            <div id="order-detail-printable" className="max-w-md mx-auto p-4 sm:p-6">
                <div className="border-2 border-dashed border-black p-4">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">Happy Hearts C&P</h1>
                        <p className="font-semibold">{order.staffName ? `Staff Order (${order.staffName})` : 'Online Order'}</p>
                    </div>
                    
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-lg">Order #{order.id}</span>
                        <span className="text-sm">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-lg font-bold mb-2">For: {order.customerName}</p>
                    <p className="text-lg font-bold mb-4">Time: {order.deliveryTime || 'ASAP'}</p>

                    <hr className="my-3 border-dashed border-black" />

                    <ul className="space-y-2">
                        {order.items.map(item => (
                            <li key={item.cartId} className="flex items-start text-lg">
                                <span className="font-bold w-12 flex-shrink-0">{item.quantity}x</span>
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    {item.selectedSize && <p className="text-sm pl-2"> - {item.selectedSize.name}</p>}
                                </div>
                                <span className="font-semibold pl-2">₱{((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>

                    <hr className="my-3 border-dashed border-black" />
                    
                    <div className="text-right">
                        <p className="font-bold text-2xl">TOTAL: ₱{order.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            
             <div className="max-w-md mx-auto text-center mt-6 print:hidden">
                <button 
                    onClick={handlePrint} 
                    className="bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto"
                >
                    <PrintIcon className="w-6 h-6" />
                    Print Order Slip
                </button>
                 <a href="#/admin/orders" className="block mt-4 text-blue-600 hover:underline">Back to Order Queue</a>
            </div>

            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #order-detail-printable, #order-detail-printable * {
                  visibility: visible;
                }
                #order-detail-printable {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  margin: 0;
                  padding: 0;
                }
                .print\\:hidden {
                    display: none;
                }
              }
            `}</style>
        </div>
    );
};

export default OrderDetailPage;