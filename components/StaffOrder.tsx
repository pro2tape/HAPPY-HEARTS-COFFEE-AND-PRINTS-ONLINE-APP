
import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, MenuItem, TimeLog, Order } from '../types';
import { useMenuData } from '../hooks/useMenuData';
import MenuItemCard from './MenuItemCard';
import Cart from './Cart';
import StaffCheckout from './StaffCheckout';
import StaffOrderConfirmationModal from './StaffOrderConfirmationModal';
import { 
  CartIcon, 
  BurgerIcon,
  HotdogIcon,
  NachosIcon,
  DrinkIcon,
  MugIcon,
  SandwichIcon,
  BowlIcon,
  FriesIcon,
  DessertIcon,
  ClipboardListIcon,
  ClockIcon,
  BanknotesIcon,
  CloseIcon
} from './Icons';

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  "Iced Coffee": DrinkIcon,
  "Fruit Soda": DrinkIcon,
  "Frappes": DrinkIcon,
  "Milktea": DrinkIcon,
  "Hot Coffee": MugIcon,
  "Burgers": BurgerIcon,
  "Hotdog": HotdogIcon,
  "Nachos": NachosIcon,
  "Clubhouse": SandwichIcon,
  "Snacks": SandwichIcon,
  "Lugaw & Sopas": BowlIcon,
  "Ramen": BowlIcon,
  "Pancit Canton": BowlIcon,
  "Fries": FriesIcon,
  "Filipino Desserts": DessertIcon,
};

// Helper for duration formatting
const formatDuration = (ms: number) => {
    if (ms < 0) ms = 0;
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

const StaffAttendanceModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    staffName: string;
    isTimedIn: boolean;
    onTimeIn: () => void;
    onTimeOut: () => void;
}> = ({ isOpen, onClose, staffName, isTimedIn, onTimeIn, onTimeOut }) => {
    const [logs, setLogs] = useState<TimeLog[]>([]);
    const [hourlyRate, setHourlyRate] = useState<number>(100);

    useEffect(() => {
        if(isOpen) {
            const timeLogsRaw = localStorage.getItem('staffTimeLogs');
            if (timeLogsRaw) setLogs(JSON.parse(timeLogsRaw));
            
            const rateRaw = localStorage.getItem('staffHourlyRate');
            if (rateRaw) setHourlyRate(Number(rateRaw));
        }
    }, [isOpen, isTimedIn]); // Reload when logs change (e.g. after time in/out)

    const stats = useMemo(() => {
        const userLogs = logs.filter(l => l.staffName === staffName);
        let totalMs = 0;
        const sessions: { date: string, in: string, out: string | null, duration: number }[] = [];
        let timeInStamp: string | null = null;

        userLogs.forEach(log => {
             if (log.type === 'in' && !timeInStamp) {
                timeInStamp = log.timestamp;
            } else if (log.type === 'out' && timeInStamp) {
                const duration = new Date(log.timestamp).getTime() - new Date(timeInStamp).getTime();
                sessions.push({ 
                    date: new Date(timeInStamp).toLocaleDateString(),
                    in: new Date(timeInStamp).toLocaleTimeString(),
                    out: new Date(log.timestamp).toLocaleTimeString(),
                    duration
                });
                totalMs += duration;
                timeInStamp = null;
            }
        });
        
        // Handle ongoing session
        if (timeInStamp) {
            const duration = new Date().getTime() - new Date(timeInStamp).getTime();
            sessions.push({ 
                date: new Date(timeInStamp).toLocaleDateString(),
                in: new Date(timeInStamp).toLocaleTimeString(),
                out: null,
                duration
            });
            // Optional: Include ongoing time in total? Usually estimated salary includes finalized time.
            // Let's include it for "estimated" view.
             totalMs += duration;
        }

        return { 
            totalHours: totalMs / 3600000, 
            sessions: sessions.reverse() 
        };
    }, [logs, staffName, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b bg-teal-50 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-teal-900 flex items-center gap-2">
                        <ClockIcon className="w-8 h-8"/> Attendance & Payroll
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        <div className="flex-1 bg-white border-2 border-teal-100 rounded-xl p-6 shadow-sm text-center">
                            <p className="text-gray-500 font-semibold mb-2">Current Status</p>
                            <div className="mb-4">
                                {isTimedIn ? (
                                    <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">CLOCKED IN</span>
                                ) : (
                                    <span className="inline-block px-4 py-1 bg-gray-200 text-gray-600 rounded-full font-bold text-sm">CLOCKED OUT</span>
                                )}
                            </div>
                            {!isTimedIn ? (
                                <button onClick={onTimeIn} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                                    TIME IN
                                </button>
                            ) : (
                                <button onClick={onTimeOut} className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors shadow-md">
                                    TIME OUT
                                </button>
                            )}
                        </div>
                        <div className="flex-1 bg-teal-50 rounded-xl p-6 shadow-sm flex flex-col justify-center gap-4">
                            <div className="flex justify-between items-center border-b border-teal-200 pb-2">
                                <span className="text-teal-800 font-semibold">Hourly Rate</span>
                                <span className="font-bold">₱{hourlyRate}</span>
                            </div>
                             <div className="flex justify-between items-center border-b border-teal-200 pb-2">
                                <span className="text-teal-800 font-semibold">Total Hours</span>
                                <span className="font-bold">{stats.totalHours.toFixed(2)} hrs</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-teal-900 font-bold text-lg">Est. Salary</span>
                                <span className="font-extrabold text-2xl text-green-700">₱{(stats.totalHours * hourlyRate).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-700 mb-3">Work History</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Time In</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Time Out</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {stats.sessions.length > 0 ? (
                                    stats.sessions.map((s, i) => (
                                        <tr key={i} className="bg-white hover:bg-gray-50">
                                            <td className="px-4 py-3">{s.date}</td>
                                            <td className="px-4 py-3">{s.in}</td>
                                            <td className="px-4 py-3 text-gray-600 italic">{s.out || 'Active'}</td>
                                            <td className="px-4 py-3 text-right font-medium">{formatDuration(s.duration)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-gray-500">No logs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StaffOrder: React.FC = () => {
  const menuData = useMenuData();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentStaffUser');
    if (user) {
        setStaffName(user);
        const timeLogsRaw = localStorage.getItem('staffTimeLogs');
        const timeLogs: TimeLog[] = timeLogsRaw ? JSON.parse(timeLogsRaw) : [];
        const lastUserLog = timeLogs.filter(log => log.staffName === user).pop();
        if (lastUserLog && lastUserLog.type === 'in') {
            setIsTimedIn(true);
        }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isStaffAuthenticated');
    localStorage.removeItem('currentStaffUser');
    window.location.hash = '#/staff/login';
  };

  const handleTimeIn = () => {
    const timeLogsRaw = localStorage.getItem('staffTimeLogs');
    const timeLogs: TimeLog[] = timeLogsRaw ? JSON.parse(timeLogsRaw) : [];
    const newLog: TimeLog = {
        staffName,
        timestamp: new Date().toISOString(),
        type: 'in',
    };
    localStorage.setItem('staffTimeLogs', JSON.stringify([...timeLogs, newLog]));
    setIsTimedIn(true);
  };

  const handleTimeOut = () => {
      const timeLogsRaw = localStorage.getItem('staffTimeLogs');
      const timeLogs: TimeLog[] = timeLogsRaw ? JSON.parse(timeLogsRaw) : [];
      const newLog: TimeLog = {
          staffName,
          timestamp: new Date().toISOString(),
          type: 'out',
      };
      localStorage.setItem('staffTimeLogs', JSON.stringify([...timeLogs, newLog]));
      setIsTimedIn(false);
  };

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
    setIsCartOpen(true);
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
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCancelCheckout = () => {
    setIsCheckoutOpen(false);
  };
  
  const handleCheckoutSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setCompletedOrder(order);
  };
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-stone-100 min-h-screen font-sans">
      <header className="bg-teal-700 text-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Staff Portal</h1>
             <div className="flex items-center gap-4">
                <p className="text-sm text-teal-100">User: <span className="font-semibold">{staffName}</span></p>
                <a href="#/admin" className="text-sm text-white hover:underline font-semibold opacity-80">&larr; Admin</a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsAttendanceOpen(true)}
                className={`flex items-center gap-2 font-bold py-2 px-3 rounded-lg transition-colors text-sm shadow-sm ${
                    isTimedIn ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
            >
                {isTimedIn ? <ClockIcon className="w-5 h-5" /> : <BanknotesIcon className="w-5 h-5" />}
                <span className="hidden sm:inline">{isTimedIn ? 'Clocked In' : 'Attendance & Payroll'}</span>
                {isTimedIn && <span className="sm:hidden">IN</span>}
            </button>

            <a href="#/staff/orders" className="flex items-center gap-1 text-white hover:text-teal-200 p-2 font-semibold text-sm" title="View Live Orders">
                <ClipboardListIcon className="w-6 h-6" />
                <span className="hidden md:inline">Orders</span>
            </a>
            
            <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-teal-200 p-2" aria-label={`Open cart with ${cartItemCount} items`}>
              <CartIcon className="h-8 w-8" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button onClick={handleLogout} className="bg-rose-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-rose-600 transition-colors text-sm">
                Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {Object.entries(menuData).map(([category, items]) => {
            const categoryItems = items as MenuItem[];
            const IconComponent = categoryIcons[category];
            return (
              <section key={category} className="mb-12">
                <div className="flex items-center gap-4 mb-6 border-b-4 border-teal-500 pb-2">
                  {IconComponent && <IconComponent className="h-10 w-10 text-teal-700" />}
                  <h2 className="text-4xl font-bold text-teal-800 tracking-tight">{category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {categoryItems.map(item => (
                    <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                  ))}
                </div>
              </section>
            );
        })}
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      {isCheckoutOpen && (
        <StaffCheckout 
            cartItems={cartItems}
            onCancel={handleCancelCheckout}
            onSuccess={handleCheckoutSuccess}
            staffName={staffName}
        />
      )}

      {completedOrder && (
        <StaffOrderConfirmationModal 
            order={completedOrder}
            onClose={() => setCompletedOrder(null)}
        />
      )}

      <StaffAttendanceModal 
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        staffName={staffName}
        isTimedIn={isTimedIn}
        onTimeIn={handleTimeIn}
        onTimeOut={handleTimeOut}
      />
    </div>
  );
};

export default StaffOrder;
