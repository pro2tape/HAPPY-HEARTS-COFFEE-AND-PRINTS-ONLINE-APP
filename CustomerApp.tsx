
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CartItem, MenuItem, Order } from './types';
import { useMenuData } from './hooks/useMenuData';
import MenuItemCard from './components/MenuItemCard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import GeminiAssistant from './components/GeminiAssistant';
import LocationSettings from './components/LocationSettings';
import { 
  CartIcon, 
  FacebookIcon, 
  InstagramIcon,
  BurgerIcon,
  HotdogIcon,
  NachosIcon,
  DrinkIcon,
  MugIcon,
  SandwichIcon,
  BowlIcon,
  FriesIcon,
  DessertIcon,
  LocationPinIcon,
  ChevronDoubleLeftIcon,
  ChevronDownIcon,
  LockIcon,
  MonitorIcon
} from './components/Icons';

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

const OrderConfirmationModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-4">Thank you! Your order is being prepared. Please show this order number at the counter for verification.</p>
          <div className="bg-gray-100 rounded-lg p-4 my-6">
            <p className="text-sm text-gray-500 mb-1">Your Order Number</p>
            <p className="text-4xl font-bold font-mono text-amber-900 tracking-wider">{order.id}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-b-xl">
           <button 
             onClick={onClose}
             className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};

const CustomerApp: React.FC = () => {
  const menuData = useMenuData();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userPosition, setUserPosition] = useState<GeolocationCoordinates | null>(null);
  // Default to first category if available, else empty string
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (Object.keys(menuData).length > 0 && !activeCategory) {
        setActiveCategory(Object.keys(menuData)[0].replace(/\s+/g, '-').replace(/&/g, 'and'));
    }
  }, [menuData, activeCategory]);

  const allMenuItems = useMemo(() => Object.values(menuData).flat(), [menuData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveCategory(entry.target.id);
            }
        });
      },
      { rootMargin: '-20% 0px -75% 0px' } 
    );

    const refs = Object.values(categoryRefs.current);
    refs.forEach((ref) => {
      if (ref instanceof HTMLElement) {
        observer.observe(ref);
      }
    });

    return () => {
      const refs = Object.values(categoryRefs.current);
      refs.forEach((ref) => {
        if (ref instanceof HTMLElement) {
          observer.unobserve(ref);
        }
      });
    };
  }, [menuData]); // Re-run when menuData changes


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

  const handleCheckoutSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setCartItems([]); // Clear cart
    setCompletedOrder(order); // Show confirmation modal
  };

  const handleLocationSave = (position: GeolocationCoordinates) => {
    setUserPosition(position);
    setIsLocationModalOpen(false);
  };
  
  const handleAddToCartFromAssistant = (item: MenuItem, quantity: number) => {
    const defaultSize = item.sizes ? item.sizes[0] : undefined;
    addToCart(item, quantity, defaultSize);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-amber-50 min-h-screen font-sans flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)} 
                className="hidden lg:inline-flex p-2 rounded-full hover:bg-amber-100 transition-colors"
                aria-label="Toggle menu"
            >
                <ChevronDoubleLeftIcon className={`w-6 h-6 text-amber-800 transition-transform duration-300 ${isMenuCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-4">
                <div className="text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight">Happy Hearts</h1>
                <p className="text-sm text-orange-600 font-semibold">Coffee & Prints</p>
                </div>
                <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/profile.php?id=61574616669270" target="_blank" rel="noopener noreferrer" aria-label="Facebook Page" className="text-amber-800 hover:text-orange-600 transition-colors">
                    <FacebookIcon className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/happyhearts_coffee_prints" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="text-amber-800 hover:text-orange-600 transition-colors">
                    <InstagramIcon className="h-6 w-6" />
                </a>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="#/kiosk" className="text-amber-800 hover:text-orange-600 p-2" aria-label="Kiosk Mode">
                <MonitorIcon className="h-6 w-6" />
            </a>
            <a href="#/admin" className="text-amber-800 hover:text-orange-600 p-2" aria-label="Admin Access">
                <LockIcon className="h-6 w-6" />
            </a>
            <button 
              onClick={() => setIsLocationModalOpen(true)} 
              className={`relative p-2 rounded-full transition-colors ${userPosition ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'text-amber-800 hover:text-orange-600'}`} 
              aria-label="Set delivery location"
            >
              <LocationPinIcon className="h-8 w-8" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative text-amber-800 hover:text-orange-600 p-2" aria-label={`Open cart with ${cartItemCount} items`}>
              <CartIcon className="h-8 w-8" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto lg:flex lg:gap-8 flex-1">
         {/* Left Sidebar - Desktop */}
        <aside className={`hidden lg:block py-8 sticky top-[88px] self-start max-h-[calc(100vh-88px)] overflow-y-auto transition-all duration-300 ${isMenuCollapsed ? 'w-24' : 'w-64'}`}>
          <nav>
            <h3 className={`text-xl font-bold text-amber-900 mb-4 px-3 whitespace-nowrap overflow-hidden transition-opacity ${isMenuCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>Menu Categories</h3>
            <ul className="space-y-1 px-3">
              {Object.keys(menuData).map(category => {
                const categoryId = category.replace(/\s+/g, '-').replace(/&/g, 'and');
                const IconComponent = categoryIcons[category];
                return (
                  <li key={category}>
                    <a
                      href={`#${categoryId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
                        setActiveCategory(categoryId);
                      }}
                      className={`flex items-center gap-4 w-full text-left p-3 rounded-lg font-semibold transition-colors ${
                        activeCategory === categoryId
                          ? 'bg-orange-500 text-white'
                          : 'text-amber-800 hover:bg-amber-100'
                      } ${isMenuCollapsed ? 'justify-center' : ''}`}
                      title={category}
                    >
                      {IconComponent && <IconComponent className="h-6 w-6 flex-shrink-0" />}
                      <span className={`whitespace-nowrap ${isMenuCollapsed ? 'sr-only' : 'block'}`}>{category}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-0">
            {/* Top Category Nav - Mobile */}
            <div className="lg:hidden mb-6 sticky top-[88px] bg-amber-50/90 backdrop-blur-sm py-2 z-10 -mx-4 px-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-full flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className="font-bold text-amber-800">Menu Categories</span>
                    <ChevronDownIcon className={`w-6 h-6 text-amber-800 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0] opacity-0'}`}>
                    <div className="min-h-0">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                        {Object.keys(menuData).map(category => {
                            const categoryId = category.replace(/\s+/g, '-').replace(/&/g, 'and');
                            const IconComponent = categoryIcons[category];
                            return (
                                <a
                                key={category}
                                href={`#${categoryId}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth' });
                                    setActiveCategory(categoryId);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg text-center font-semibold text-xs transition-colors h-20 ${
                                    activeCategory === categoryId
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-white text-amber-800 shadow-sm'
                                }`}
                                >
                                {IconComponent && <IconComponent className="h-8 w-8 mb-1" />}
                                <span className="leading-tight">{category}</span>
                                </a>
                            );
                        })}
                        </div>
                    </div>
                </div>
            </div>

            {Object.entries(menuData).map(([category, items]) => {
                const categoryItems = items as MenuItem[];
                const IconComponent = categoryIcons[category];
                const categoryId = category.replace(/\s+/g, '-').replace(/&/g, 'and');
                return (
                <section 
                    key={category} 
                    id={categoryId}
                    ref={el => {categoryRefs.current[categoryId] = el}}
                    className="mb-12 scroll-mt-32"
                >
                    <div className="flex items-center gap-4 mb-6 border-b-4 border-orange-400 pb-2">
                    {IconComponent && <IconComponent className="h-10 w-10 text-amber-800" />}
                    <h2 className="text-4xl font-bold text-amber-800 tracking-tight">{category}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {categoryItems.map(item => (
                        <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                    ))}
                    </div>
                </section>
                );
            })}
            
            {Object.keys(menuData).length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">Menu is currently being updated. Please check back later.</p>
                </div>
            )}
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
             <p className="mb-4">© {new Date().getFullYear()} Happy Hearts Coffee & Prints. All rights reserved.</p>
             <div className="flex justify-center gap-6 text-sm">
                <a href="#/admin" className="flex items-center gap-1 hover:text-white transition-colors">
                    <LockIcon className="w-4 h-4" />
                    Admin Access
                </a>
                <a href="#/staff/login" className="flex items-center gap-1 hover:text-white transition-colors">
                    <LockIcon className="w-4 h-4" />
                    Staff Access
                </a>
             </div>
          </div>
      </footer>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      {isCheckoutOpen && (
        <Checkout 
            cartItems={cartItems}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleCheckoutSuccess}
            userPosition={userPosition}
        />
      )}

      {completedOrder && (
        <OrderConfirmationModal 
            order={completedOrder}
            onClose={() => setCompletedOrder(null)}
        />
      )}

      <LocationSettings
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSave={handleLocationSave}
        currentPosition={userPosition}
      />

      <GeminiAssistant menuItems={allMenuItems} onAddToCart={handleAddToCartFromAssistant} />
    </div>
  );
};

export default CustomerApp;
