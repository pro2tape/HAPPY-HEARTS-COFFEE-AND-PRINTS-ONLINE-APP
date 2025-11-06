import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Order } from '../types';
import OrderPrintModal from './OrderPrintModal';
import { PrintIcon, CloseIcon, CopyIcon, MotorcycleIcon } from './Icons';

// A simple notification sound
const notificationSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaW5nIMKlIE5ld3NmbGFzaC5jb20Arg==");

const OrderCard: React.FC<{ order: Order; onUpdateStatus: (id: string, status: Order['status']) => void; onPrint: (order: Order) => void; onCancel: (id: string) => void; }> = ({ order, onUpdateStatus, onPrint, onCancel }) => {
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const orderLink = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}#/order/${order.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(orderLink).then(() => {
            setIsLinkCopied(true);
            setTimeout(() => setIsLinkCopied(false), 2000);
        });
    };

    const borderColor = order.isMessengerDelivery ? 'border-purple-500' : 'border-blue-500';

    return (
        <div className={`bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 ${borderColor}`}>
            {order.isMessengerDelivery && (
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <MotorcycleIcon className="w-5 h-5" />
                    <p className="font-bold text-sm">Messenger Delivery</p>
                </div>
            )}
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800">{order.customerName}</p>
                    <a href={`#/order/${order.id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Order #{order.id}
                    </a>
                    <p className="text-sm text-gray-500">{timeSince(order.date)}</p>
                </div>
                <div className="text-right">
                     <p className="font-bold text-xl text-gray-900">₱{order.total.toFixed(2)}</p>
                     <p className="text-sm text-gray-500">{order.staffName ? `Staff: ${order.staffName}`: 'Online Order'}</p>
                </div>
            </div>
             <hr className="my-3"/>
            <ul className="text-sm space-y-1 mb-4">
                {order.items.map(item => (
                    <li key={item.cartId}>
                        <span className="font-semibold">{item.quantity}x</span> {item.name} {item.selectedSize ? `(${item.selectedSize.name})` : ''}
                    </li>
                ))}
            </ul>
             <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {order.status === 'new' && (
                        <button onClick={() => onUpdateStatus(order.id, 'in-progress')} className="bg-green-500 text-white font-bold py-1 px-3 rounded-full text-sm hover:bg-green-600">Acknowledge</button>
                    )}
                    {order.status === 'in-progress' && (
                        <button onClick={() => onUpdateStatus(order.id, 'completed')} className="bg-blue-500 text-white font-bold py-1 px-3 rounded-full text-sm hover:bg-blue-600">Complete</button>
                    )}
                    {(order.status === 'new' || order.status === 'in-progress') && (
                        <button onClick={() => onCancel(order.id)} className="bg-red-500 text-white font-bold py-1 px-3 rounded-full text-sm hover:bg-red-600">Cancel</button>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={handleCopyLink} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full relative" title="Copy order link">
                        <CopyIcon className="w-5 h-5"/>
                        {isLinkCopied && <span className="absolute -top-6 -right-2 bg-black text-white text-xs rounded px-1">Copied!</span>}
                    </button>
                    <button onClick={() => onPrint(order)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" title="Print receipt">
                        <PrintIcon className="w-5 h-5"/>
                    </button>
                </div>
             </div>
        </div>
    );
};


const OrderQueue: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const prevOrderCount = useRef(0);
    const backLink = window.location.hash.includes('#/staff') ? '#/staff' : '#/admin';


    const loadOrders = () => {
        const storedOrders = localStorage.getItem('orders');
        const parsedOrders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
        setOrders(parsedOrders.slice().reverse()); // Show newest first
    };

    useEffect(() => {
        loadOrders();
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'orders') {
                loadOrders();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const newOrders = orders.filter(o => o.status === 'new').length;
        if (newOrders > prevOrderCount.current) {
            notificationSound.play().catch(e => console.error("Error playing sound:", e));
        }
        prevOrderCount.current = newOrders;
    }, [orders]);

    const handleUpdateStatus = (orderId: string, status: Order['status']) => {
        const storedOrdersRaw = localStorage.getItem('orders');
        const storedOrders: Order[] = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
        const updatedOrders = storedOrders.map(o => o.id === orderId ? { ...o, status } : o);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        loadOrders(); // Manually trigger reload for the current tab
    };

    const handleCancelOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel and remove this order? This action cannot be undone.')) {
            const storedOrdersRaw = localStorage.getItem('orders');
            const storedOrders: Order[] = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
            const updatedOrders = storedOrders.filter(o => o.id !== orderId);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            loadOrders(); // Manually trigger reload for the current tab
        }
    };

    const { newOrders, inProgressOrders, completedOrders } = useMemo(() => {
        const today = new Date().toDateString();
        return {
            newOrders: orders.filter(o => o.status === 'new'),
            inProgressOrders: orders.filter(o => o.status === 'in-progress'),
            completedOrders: orders.filter(o => o.status === 'completed' && new Date(o.date).toDateString() === today),
        };
    }, [orders]);


    return (
        <div className="bg-gray-100 min-h-screen font-sans">
             <header className="bg-gray-800 text-white shadow-md sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Live Order Queue</h1>
                    </div>
                    <div className="flex items-center gap-4">
                       <a href={backLink} className="text-sm text-gray-300 hover:underline font-semibold whitespace-nowrap">&larr; Back to Dashboard</a>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* New Orders Column */}
                <div className="bg-red-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold text-red-800 mb-4 sticky top-[80px] bg-red-100 py-2">
                        New Orders ({newOrders.length})
                    </h2>
                    <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
                        {newOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} onPrint={setSelectedOrder} onCancel={handleCancelOrder} />)}
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-yellow-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold text-yellow-800 mb-4 sticky top-[80px] bg-yellow-100 py-2">
                        In Progress ({inProgressOrders.length})
                    </h2>
                     <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
                        {inProgressOrders.map(order => <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} onPrint={setSelectedOrder} onCancel={handleCancelOrder} />)}
                    </div>
                </div>

                {/* Completed Column */}
                <div className="bg-green-100 p-4 rounded-lg">
                    <h2 className="text-xl font-bold text-green-800 mb-4 sticky top-[80px] bg-green-100 py-2">
                        Completed Today ({completedOrders.length})
                    </h2>
                     <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
                        {completedOrders.map(order => (
                             <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-gray-400 opacity-80">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-700">{order.customerName}</p>
                                        <p className="text-sm text-gray-500">#{order.id.slice(-6)}</p>
                                    </div>
                                    <p className="font-bold text-gray-800">₱{order.total.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-end mt-2">
                                     <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-full">
                                        <PrintIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
             {selectedOrder && (
                <OrderPrintModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default OrderQueue;