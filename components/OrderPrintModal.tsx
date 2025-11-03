import React from 'react';
import { Order } from '../types';
import { PrintIcon } from './Icons';

interface OrderPrintModalProps {
  order: Order;
  onClose: () => void;
}

// A reusable component for the receipt content to avoid duplication
const ReceiptContent: React.FC<{ order: Order; copyType: 'SHOP' | 'CUSTOMER' }> = ({ order, copyType }) => (
    <div className="p-6 font-mono">
        <h2 className="text-center text-xl font-bold mb-2">Happy Hearts C&amp;P</h2>
        <p className="text-center text-sm font-bold uppercase">{copyType} Copy</p>
        <hr className="my-3 border-dashed border-black" />

        <div className="text-sm space-y-1">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
        </div>

        <hr className="my-3 border-dashed border-black" />

        <table className="w-full text-sm">
            <thead>
                <tr>
                    <th className="text-left py-1 pr-1 font-bold">QTY</th>
                    <th className="text-left py-1 px-1 font-bold">ITEM</th>
                    <th className="text-right py-1 pl-1 font-bold">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {order.items.map(item => (
                    <tr key={item.cartId}>
                        <td className="align-top pr-1">{item.quantity}x</td>
                        <td className="align-top px-1">
                            {item.name}
                            {item.selectedSize && <span className="block text-xs">({item.selectedSize.name})</span>}
                        </td>
                        <td className="text-right align-top pl-1">₱{((item.selectedSize?.price || item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <hr className="my-3 border-dashed border-black" />
        
        <div className="text-sm space-y-1 text-right">
            <p>Subtotal: ₱{order.subtotal.toFixed(2)}</p>
            <p>Delivery: ₱{order.deliveryFee.toFixed(2)}</p>
            <p className="font-bold text-base">TOTAL: ₱{order.total.toFixed(2)}</p>
        </div>
        
        {copyType === 'CUSTOMER' && (
            <>
                <hr className="my-3 border-dashed border-black" />
                <p className="text-center text-xs">Thank you for your order!</p>
            </>
        )}
    </div>
);

const OrderPrintModal: React.FC<OrderPrintModalProps> = ({ order, onClose }) => {
    
    const handlePrint = () => {
        const printContents = document.getElementById('printable-order-content')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            const style = document.createElement('style');
            style.innerHTML = `@media print { .page-break { page-break-after: always; } }`;
            document.head.appendChild(style);

            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); 
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh]">
                {/* This content is for printing only */}
                <div id="printable-order-content" className="hidden">
                    <div className="page-break">
                        <ReceiptContent order={order} copyType="SHOP" />
                    </div>
                    <div>
                        <ReceiptContent order={order} copyType="CUSTOMER" />
                    </div>
                </div>

                {/* This content is for modal display */}
                <div className="overflow-y-auto">
                    <ReceiptContent order={order} copyType="SHOP" />
                </div>

                <div className="p-4 bg-gray-50 rounded-b-xl flex justify-between items-center mt-auto">
                    <button onClick={onClose} className="text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                    <button onClick={handlePrint} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                        <PrintIcon className="w-5 h-5" />
                        Print (Shop &amp; Customer)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPrintModal;
