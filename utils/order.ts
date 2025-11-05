
export const generateNewOrderId = (): string => {
  try {
    const lastOrderIdRaw = localStorage.getItem('lastOrderId');
    // Initialize with 0 so the first order ID is 1
    let lastOrderId = lastOrderIdRaw ? parseInt(lastOrderIdRaw, 10) : 0;
    
    // Handle cases where parsing might result in NaN
    if (isNaN(lastOrderId)) {
        lastOrderId = 0;
    }

    const newOrderId = lastOrderId + 1;
    localStorage.setItem('lastOrderId', newOrderId.toString());
    
    return newOrderId.toString();
  } catch (e) {
    console.error("Failed to generate new sequential order ID:", e);
    // Fallback to timestamp if local storage fails to prevent app from breaking.
    return Date.now().toString();
  }
};
