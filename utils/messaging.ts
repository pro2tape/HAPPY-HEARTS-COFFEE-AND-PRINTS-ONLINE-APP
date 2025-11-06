import { Order } from '../types';

export const FACEBOOK_PAGE_ID = '61574616669270';

export function generateOrderMessage(order: Order): string {
  const orderType = order.isMessengerDelivery ? 'Messenger Delivery' : (order.staffName === 'Kiosk' ? 'Kiosk Order' : 'Walk-in/Take-out');
  const orderLink = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}#/order/${order.id}`;

  const itemsList = order.items.map(item => 
    `- ${item.quantity}x ${item.name}${item.selectedSize ? ` (${item.selectedSize.name})` : ''}`
  ).join('\n');

  let message = `
🔔 *NEW ORDER - ${orderType}* 🔔

*Order #:* ${order.id}
*For:* ${order.customerName}
*Time:* ${order.deliveryTime || 'ASAP'}
*Staff:* ${order.staffName || 'Online'}

*Items:*
${itemsList}

-------------------------
*Subtotal:* ₱${order.subtotal.toFixed(2)}
*Delivery Fee:* ₱${order.deliveryFee.toFixed(2)}
*TOTAL:* *₱${order.total.toFixed(2)}*
-------------------------
`;

  if (order.isMessengerDelivery && order.messengerName) {
    message += `
*Delivery Details:*
- *Service:* ${order.messengerName}
- *Contact:* ${order.messengerContact}
-------------------------
`;
  }

  message += `
*Link to full slip:*
${orderLink}
  `;

  return message.trim();
}
