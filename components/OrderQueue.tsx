import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Order } from '../types';
import OrderPrintModal from './OrderPrintModal';
import { PrintIcon, QrCodeIcon, CloseIcon } from './Icons';

// A simple notification sound
const notificationSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaW5nIMKlIE5ld3NmbGFzaC5jb20Arg==");


const QrScannerModal: React.FC<{ onClose: () => void; onScan: (data: string) => void }> = ({ onClose, onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // FIX: Initialize useRef with null to avoid argument error and handle potential race conditions.
    const requestRef = useRef<number | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const scriptId = 'jsqr-script';
        let stream: MediaStream | null = null;

        const cleanup = () => {
            // FIX: Check against null to correctly handle request ID 0.
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };

        const tick = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    const ctx = canvas.getContext("2d", { willReadFrequently: true });
                    // @ts-ignore - jsQR is loaded from a script
                    if (ctx && window.jsQR) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        // @ts-ignore
                        const code = window.jsQR(imageData.data, imageData.width, imageData.height);
                        
                        if (code) {
                            onScan(code.data);
                            cleanup();
                            onClose();
                            return; // Stop the loop
                        }
                    }
                }
            }
            requestRef.current = requestAnimationFrame(tick);
        };

        const startScan = () => {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        requestRef.current = requestAnimationFrame(tick);
                    }
                })
                .catch(err => {
                    console.error("Camera access error:", err);
                    setError('Could not access camera. Please check permissions.');
                });
        };

        // @ts-ignore
        if (window.jsQR) {
            startScan();
        } else {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
            script.async = true;
            document.body.appendChild(script);
            script.onload = startScan;
        }

        return cleanup;
    }, [onClose, onScan]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 z-10">
                    <CloseIcon className="h-6 w-6" />
                </button>
                <div className="aspect-video relative">
                    <video ref={videoRef} className="w-full h-full object-cover rounded-t-xl" playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-4 border-dashed border-white/80 rounded-lg"></div>
                    </div>
                </div>
                <div className="p-4 text-center">
                    {error ? <p className="text-red-500 font-semibold">{error}</p> : <p className="text-gray-700 font-semibold">Point camera at an order QR code</p>}
                </div>
            </div>
        </div>
    );
};


const OrderCard: React.FC<{ order: Order; onUpdateStatus: (id: string, status: Order['status']) => void; onPrint: (order: Order) => void; onCancel: (id: string) => void; }> = ({ order, onUpdateStatus, onPrint, onCancel }) => {
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

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-gray-800">{order.customerName}</p>
                    <p className="text-sm text-gray-500">#{order.id.slice(-6)} &bull; {timeSince(order.date)}</p>
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
                <button onClick={() => onPrint(order)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                    <PrintIcon className="w-5 h-5"/>
                </button>
             </div>
        </div>
    );
};


const OrderQueue: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
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

    const handleScan = (orderId: string) => {
      const storedOrdersRaw = localStorage.getItem('orders');
      const storedOrders: Order[] = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
      const foundOrder = storedOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setSelectedOrder(foundOrder); // This will open the OrderPrintModal
      } else {
        alert(`Order with ID ${orderId} not found.`);
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
                       <button
                         onClick={() => setIsScannerOpen(true)}
                         className="flex items-center gap-2 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
                       >
                         <QrCodeIcon className="w-5 h-5" />
                         Scan Order
                       </button>
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
            {isScannerOpen && (
                <QrScannerModal
                    onClose={() => setIsScannerOpen(false)}
                    onScan={handleScan}
                />
            )}
        </div>
    );
};

export default OrderQueue;