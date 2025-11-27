import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CartItem, MenuItem, Order } from './types';
import { useMenuData } from './hooks/useMenuData';
import MenuItemCard from './components/MenuItemCard';
import KioskCheckout from './components/KioskCheckout';
import { TrashIcon } from './components/Icons';

const KIOSK_RESET_TIMEOUT = 60000; // 60 seconds
const CONFIRMATION_TIMEOUT = 30000; // 30 seconds

const KioskApp: React.FC = () => {
    const menuData = useMenuData();
    const [view, setView] = useState<'welcome' | 'ordering' | 'confirmation'>('welcome');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    // Default category needs menuData to be loaded
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    
    const activityTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (Object.keys(menuData).length > 0 && !activeCategory) {
            setActiveCategory(Object.keys(menuData)[0]);
        }
    }, [menuData, activeCategory]);

    const resetKiosk = () => {
        setCartItems([]);
        setCompletedOrder(null);
        if (Object.keys(menuData).length > 0) {
            setActiveCategory(Object.keys(menuData)[0]);
        }
        setView('welcome');
    };

    const resetActivityTimer = () => {
        if (activityTimerRef.current) {
            clearTimeout(activityTimerRef.current);
        }
        activityTimerRef.current = window.setTimeout(() => {
            resetKiosk();
        }, view === 'confirmation' ? CONFIRMATION_TIMEOUT : KIOSK_RESET_TIMEOUT);
    };

    useEffect(() => {
        resetActivityTimer();
        return () => {
            if (activityTimerRef.current) {
                clearTimeout(activityTimerRef.current);
            }
        };
    }, [view, cartItems]);


    const addToCart = (itemToAdd: MenuItem, quantity: number, selectedSize?: { name: string; price: number }) => {
        const cartId = selectedSize ? `${itemToAdd.id}-${selectedSize.name}` : `${itemToAdd.id}`;
        
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.cartId === cartId);
            if (existingItem) {
            return prevItems.map(item =>
                item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
            );
            }
            const newItem: CartItem = {
            ...itemToAdd,
            cartId,
            quantity,
            selectedSize,
            };
            return [...prevItems, newItem];
        });
    };

    const updateCartQuantity = (cartId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(cartId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (cartId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };

    const handleCheckoutSuccess = (order: Order) => {
        setIsCheckoutOpen(false);
        setCartItems([]);
        setCompletedOrder(order);
        setView('confirmation');
    };

    const total = useMemo(() => cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || item.price) * item.quantity, 0), [cartItems]);
    const cartItemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

    const WelcomeScreen = () => (
        <div 
            className="h-screen w-screen flex flex-col items-center justify-center text-white bg-cover bg-center" 
            style={{backgroundImage: 'url(https://images.unsplash.com/photo-1511920183353-3c9c644919de?q=80&w=1974&auto=format&fit=crop)'}}
            onClick={() => setView('ordering')}
        >
            <div className="bg-black bg-opacity-50 p-12 rounded-xl text-center">
                <h1 className="text-6xl font-extrabold tracking-tight">Happy Hearts</h1>
                <p className="text-2xl font-semibold text-orange-300">Coffee & Prints</p>
                <div className="mt-12 p-6 bg-orange-500 rounded-lg text-4xl font-bold animate-pulse cursor-pointer">
                    Tap to Start Ordering
                </div>
            </div>
        </div>
    );
    
    const ConfirmationScreen = () => (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-green-50" onClick={resetKiosk}>
            <div className="text-center p-12 bg-white shadow-2xl rounded-2xl">
                <h2 className="text-5xl font-bold text-green-600 mb-4">Order Placed! Thank You!</h2>
                <p className="text-xl text-gray-600 mb-8">Please listen for your order number and pay at the counter.</p>
                <div className="bg-gray-100 rounded-lg p-8">
                    <p className="text-2xl text-gray-500 mb-2">Your Order Number</p>
                    <p className="text-9xl font-bold font-mono text-amber-900 tracking-wider">{completedOrder?.id}</p>
                </div>
                 <button onClick={resetKiosk} className="mt-12 w-full bg-orange-500 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-colors text-2xl">
                    Start New Order
                </button>
            </div>
        </div>
    );

    if (view === 'welcome') return <WelcomeScreen />;
    if (view === 'confirmation' && completedOrder) return <ConfirmationScreen />;

    return (
        <div className="h-screen w-screen flex bg-gray-100 font-sans" onClick={resetActivityTimer}>
            {/* Category Sidebar */}
            <aside className="w-1/4 bg-white shadow-md flex-shrink-0 overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-3xl font-bold text-amber-900 mb-6">Categories</h2>
                    <ul className="space-y-2">
                        {Object.keys(menuData).map(category => (
                            <li key={category}>
                                <button
                                    onClick={() => setActiveCategory(category)}
                                    className={`w-full text-left p-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                                        activeCategory === category
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-800 hover:bg-amber-100'
                                    }`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Menu Items */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-5xl font-bold text-amber-800 tracking-tight mb-8">{activeCategory}</h2>
                {menuData[activeCategory] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {menuData[activeCategory].map(item => (
                            <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                        ))}
                    </div>
                )}
            </main>

            {/* Cart Sidebar */}
            <aside className="w-1/3 bg-white shadow-lg flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-4xl font-bold text-amber-900">Your Order</h2>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-center mt-8 text-xl">Your cart is empty.</p>
                    ) : (
                        <ul className="divide-y">
                            {cartItems.map(item => (
                                <li key={item.cartId} className="flex items-center py-4">
                                    <div className="flex-grow">
                                        <p className="font-bold text-lg text-gray-800">{item.name}</p>
                                        {item.selectedSize && <p className="text-md text-gray-500">{item.selectedSize.name}</p>}
                                        <p className="text-md text-gray-600 font-semibold">₱{item.selectedSize?.price || item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateCartQuantity(item.cartId, parseInt(e.target.value, 10))}
                                            className="w-16 text-center text-lg border rounded-lg p-1"
                                            min="1"
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <TrashIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-6 border-t bg-gray-50">
                        <div className="flex justify-between items-center text-3xl font-bold mb-6">
                            <span>Total:</span>
                            <span>₱{total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full bg-green-500 text-white font-bold py-5 rounded-lg hover:bg-green-600 transition-colors text-3xl"
                        >
                            Checkout ({cartItemCount})
                        </button>
                    </div>
                )}
            </aside>
            {isCheckoutOpen && (
                <KioskCheckout 
                    cartItems={cartItems}
                    onClose={() => setIsCheckoutOpen(false)}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </div>
    );
};

export default KioskApp;