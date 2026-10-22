// src/services/dataService.js
// Shared data service for both admin and user sides

// Initialize with Mohamed Ali's family
let sharedFamilies = {
  "TN333472120886": {
    cardNumber: "TN333472120886",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: "42 Valluvar Street, Triplicane, Chennai - 600005",
    rationType: "BPL (Below Poverty Line)",
    monthlyQuota: { rice: 45, wheat: 35, sugar: 8, kerosene: 5 },
    members: [
      { id: 1, name: "Mohamed Ali", relation: "Head", icon: "👨", age: 45, gender: "Male", occupation: "Auto Driver", aadhar: "9876-5432-1098", addedAt: new Date().toISOString() },
      { id: 2, name: "Kolusam Beevi", relation: "Wife", icon: "👩", age: 40, gender: "Female", occupation: "Homemaker", aadhar: "8765-4321-0987", addedAt: new Date().toISOString() },
      { id: 3, name: "Mohamed Azarudeen", relation: "Son", icon: "👦", age: 18, gender: "Male", occupation: "College Student", aadhar: "7654-3210-9876", addedAt: new Date().toISOString() },
      { id: 4, name: "Mohamed Althaf", relation: "Son", icon: "👦", age: 14, gender: "Male", occupation: "School Student", aadhar: "6543-2109-8765", addedAt: new Date().toISOString() }
    ]
  }
};

// Initialize products
let sharedProducts = [
  { id: '1', name: 'Premium Rice', price: 35, limit: 25, unit: 'kg', image: '🍚', stock: 1000 },
  { id: '2', name: 'Whole Wheat', price: 25, limit: 20, unit: 'kg', image: '🌾', stock: 800 },
  { id: '3', name: 'Refined Sugar', price: 40, limit: 5, unit: 'kg', image: '🍬', stock: 500 },
  { id: '4', name: 'Kerosene', price: 15, limit: 2, unit: 'L', image: '🛢️', stock: 300 }
];

let sharedTransactions = [];

// ---------- Families ----------
export const getFamilies = () => ({ ...sharedFamilies });
export const getFamily = (cardNumber) => sharedFamilies[cardNumber] ? { ...sharedFamilies[cardNumber] } : null;

export const addFamily = (cardNumber, familyData) => {
  sharedFamilies[cardNumber] = { ...familyData, cardNumber, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), members: familyData.members || [] };
  window.dispatchEvent(new CustomEvent('familiesUpdated', { detail: { cardNumber, family: sharedFamilies[cardNumber], action: 'add' } }));
  return sharedFamilies[cardNumber];
};

export const updateFamily = (cardNumber, updates) => {
  if (sharedFamilies[cardNumber]) {
    sharedFamilies[cardNumber] = { ...sharedFamilies[cardNumber], ...updates, updatedAt: new Date().toISOString() };
    window.dispatchEvent(new CustomEvent('familiesUpdated', { detail: { cardNumber, family: sharedFamilies[cardNumber], action: 'update' } }));
  }
  return sharedFamilies[cardNumber];
};

export const deleteFamily = (cardNumber) => {
  delete sharedFamilies[cardNumber];
  window.dispatchEvent(new CustomEvent('familiesUpdated', { detail: { cardNumber, deleted: true, action: 'delete' } }));
};

export const addFamilyMember = (cardNumber, member) => {
  if (sharedFamilies[cardNumber]) {
    if (!sharedFamilies[cardNumber].members) sharedFamilies[cardNumber].members = [];
    const newMember = { ...member, id: member.id || `member_${Date.now()}_${Math.random().toString(36).substr(2,5)}`, addedAt: new Date().toISOString() };
    sharedFamilies[cardNumber].members.push(newMember);
    sharedFamilies[cardNumber].updatedAt = new Date().toISOString();
    window.dispatchEvent(new CustomEvent('familiesUpdated', { detail: { cardNumber, family: sharedFamilies[cardNumber], action: 'addMember' } }));
    return newMember;
  }
  return null;
};

export const updateFamilyMember = (cardNumber, memberId, updates) => {
  if (sharedFamilies[cardNumber]?.members) {
    sharedFamilies[cardNumber].members = sharedFamilies[cardNumber].members.map(m => m.id === memberId ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
    sharedFamilies[cardNumber].updatedAt = new Date().toISOString();
    window.dispatchEvent(new CustomEvent('familiesUpdated', { detail: { cardNumber, family: sharedFamilies[cardNumber], action: 'updateMember' } }));
    return sharedFamilies[cardNumber].members.find(m => m.id === memberId);
  }
  return null;
};

export const deleteFamilyMember = (cardNumber, memberId) => {
  if (sharedFamilies[cardNumber]?.members) {
    sharedFamilies[cardNumber].members = sharedFamilies[cardNumber].members.filter(m => m.id !== memberId);
    sharedFamilies[cardNumber].updatedAt = new Date().toISOString();
    window.dispatchEvent(new CustomEvent('familiesUpdated', { detail: { cardNumber, family: sharedFamilies[cardNumber], action: 'deleteMember' } }));
  }
};

// ---------- Products ----------
export const getProducts = () => [...sharedProducts];

// Notify product updates
const notifyProductUpdate = (action, product) => {
  window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { action, product } }));
};

export const addProduct = (product) => {
  const newProduct = { ...product, id: product.id || `prod_${Date.now()}` };
  sharedProducts.push(newProduct);
  notifyProductUpdate('add', newProduct);
  return newProduct;
};

export const updateProduct = (id, updates) => {
  const index = sharedProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    sharedProducts[index] = { ...sharedProducts[index], ...updates };
    notifyProductUpdate('update', sharedProducts[index]);
    return sharedProducts[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  sharedProducts = sharedProducts.filter(p => p.id !== id);
  notifyProductUpdate('delete', { id });
};

export const updateProductLimit = (id, newLimit) => {
  const product = sharedProducts.find(p => p.id === id);
  if (product) {
    product.limit = newLimit;
    notifyProductUpdate('update', product);
  }
  return product;
};

export const updateProductPrice = (id, newPrice) => {
  const product = sharedProducts.find(p => p.id === id);
  if (product) {
    product.price = newPrice;
    notifyProductUpdate('update', product);
  }
  return product;
};

export const updateProductStock = (id, newStock) => {
  const product = sharedProducts.find(p => p.id === id);
  if (product) {
    product.stock = newStock;
    notifyProductUpdate('update', product);
  }
  return product;
};

export const updateProductImage = (id, newImage) => {
  const product = sharedProducts.find(p => p.id === id);
  if (product) {
    product.image = newImage;
    notifyProductUpdate('update', product);
  }
  return product;
};

// ---------- Transactions ----------
export const addTransaction = (transaction) => {
  const newTransaction = { ...transaction, status: 'pending', deliveryStatus: 'pending', createdAt: new Date().toISOString() };
  sharedTransactions.push(newTransaction);
  return newTransaction;
};

export const getTransactions = () => [...sharedTransactions];
export const getTransactionsByCard = (cardNumber) => sharedTransactions.filter(t => t.card === cardNumber);

export const approveTransaction = (transactionId) => {
  const tx = sharedTransactions.find(t => t.id === transactionId);
  if (tx) {
    tx.status = 'approved';
    tx.approvedAt = new Date().toISOString();
    window.dispatchEvent(new CustomEvent('transactionUpdated', { detail: tx }));
  }
  return tx;
};

export const cancelTransaction = (transactionId) => {
  const tx = sharedTransactions.find(t => t.id === transactionId);
  if (tx) {
    tx.status = 'cancelled';
    tx.cancelledAt = new Date().toISOString();
    window.dispatchEvent(new CustomEvent('transactionUpdated', { detail: tx }));
  }
  return tx;
};

export const updateDeliveryStatus = (transactionId, deliveryStatus) => {
  const tx = sharedTransactions.find(t => t.id === transactionId);
  if (tx) {
    tx.deliveryStatus = deliveryStatus;
    if (deliveryStatus === 'delivered') tx.deliveredAt = new Date().toISOString();
    window.dispatchEvent(new CustomEvent('transactionUpdated', { detail: tx }));
  }
  return tx;
};

export const canPurchaseThisMonth = (cardNumber) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const approvedTx = sharedTransactions.filter(t => t.card === cardNumber && t.status === 'approved');
  const lastApproved = approvedTx.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  if (!lastApproved) return true;
  return lastApproved.createdAt.slice(0, 7) !== currentMonth;
};

// ---------- Subscriptions ----------
export const subscribeToUpdates = (callback) => {
  const handler = (e) => callback(e.detail);
  window.addEventListener('familiesUpdated', handler);
  window.addEventListener('transactionUpdated', handler);
  window.addEventListener('productsUpdated', handler);
  return () => {
    window.removeEventListener('familiesUpdated', handler);
    window.removeEventListener('transactionUpdated', handler);
    window.removeEventListener('productsUpdated', handler);
  };
};