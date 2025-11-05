
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  sizes?: { name:string; price: number }[];
}

export interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
  selectedSize?: { name: string; price: number };
}

export interface MenuData {
  [key: string]: MenuItem[];
}

export interface RecommendedItem {
  id: number;
  reason: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  deliveryTime?: string; // e.g., "ASAP" or a specific time like "14:30"
  staffName?: string; // Who took the order
  status: 'new' | 'in-progress' | 'completed';
}

export interface TimeLog {
  staffName: string;
  timestamp: string; // ISO string for date and time
  type: 'in' | 'out';
}

export interface StaffAccount {
  username: string;
  password?: string;
}