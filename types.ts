
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
}