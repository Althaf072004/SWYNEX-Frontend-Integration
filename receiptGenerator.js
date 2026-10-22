export const generateReceiptText = (data, items) => {
  let receiptContent = `RATION SMART CARD SERVICE - OFFICIAL RECEIPT\n`;
  receiptContent += `============================================\n`;
  receiptContent += `Transaction ID: ${data.id}\n`;
  receiptContent += `Smart Card:     ${data.card}\n`;
  receiptContent += `Member:         ${data.member}\n`;
  receiptContent += `Date:           ${data.date}\n`;
  receiptContent += `Total Amount:   ${data.total}\n\n`;
  receiptContent += `ITEMS PURCHASED:\n`;
  
  Object.keys(data.items).forEach(id => {
    const item = items.find(i => i.id === id);
    const qty = data.items[id];
    receiptContent += `• ${item.name}: ${qty} ${item.unit} - ₹${(qty * item.pricePerUnit).toFixed(2)}\n`;
  });
  
  receiptContent += `\nPayment Method: ${data.payment.toUpperCase()}\n`;
  receiptContent += `Biometric:      ${data.biometric.toUpperCase()}\n\n`;
  receiptContent += `Thank you for using Ration Smart Card Service!\n`;
  receiptContent += `Collect within 7 days from your ration shop.\n`;
  receiptContent += `============================================\n`;

  return receiptContent;
};

export const downloadReceipt = (receiptText, transactionId) => {
  const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ration_Receipt_${transactionId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};