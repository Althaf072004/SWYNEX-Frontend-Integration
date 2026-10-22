export const formatCurrency = (amount) => {
  return `₹ ${amount.toFixed(2)}`;
};

export const calculateTotal = (cart, items) => {
  return Object.keys(cart).reduce((total, id) => {
    const item = items.find(i => i.id === id);
    return total + (cart[id] * item.pricePerUnit);
  }, 0);
};

export const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const getCurrentDateTime = () => {
  return new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));