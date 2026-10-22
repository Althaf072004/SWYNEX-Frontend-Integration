// User Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Default Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: 'admin@ration.gov',
  password: 'Admin@123',
  cardNumber: 'ADMIN001'
};

// Ration Items with images and categories
export const RATION_ITEMS = [
  { 
    id: 'rawRice', 
    name: 'Raw Rice', 
    maxQty: 5, 
    unit: 'kg', 
    pricePerUnit: 10, 
    icon: '🍚', 
    image: '/images/raw-rice.jpg',
    category: 'Grains',
    increment: 1,
    stock: 1000,
    description: 'High quality raw rice'
  },
  { 
    id: 'parboiledRice', 
    name: 'Parboiled Rice', 
    maxQty: 15, 
    unit: 'kg', 
    pricePerUnit: 8, 
    icon: '🍚', 
    image: '/images/parboiled-rice.jpg',
    category: 'Grains',
    increment: 1,
    stock: 2000,
    description: 'Nutritious parboiled rice'
  },
  { 
    id: 'toorDal', 
    name: 'Toor Dal', 
    maxQty: 2, 
    unit: 'kg', 
    pricePerUnit: 80, 
    icon: '🌰', 
    image: '/images/toor-dal.jpg',
    category: 'Pulses',
    increment: 1,
    stock: 500,
    description: 'Premium quality toor dal'
  },
  { 
    id: 'wheat', 
    name: 'Wheat', 
    maxQty: 2, 
    unit: 'kg', 
    pricePerUnit: 25, 
    icon: '🌾', 
    image: '/images/wheat.jpg',
    category: 'Grains',
    increment: 1,
    stock: 800,
    description: 'Whole wheat grains'
  },
  { 
    id: 'salt', 
    name: 'Salt', 
    maxQty: 1, 
    unit: 'kg', 
    pricePerUnit: 10, 
    icon: '🧂', 
    image: '/images/salt.jpg',
    category: 'Condiments',
    increment: 1,
    stock: 1500,
    description: 'Iodized salt'
  },
  { 
    id: 'sugar', 
    name: 'Sugar', 
    maxQty: 2, 
    unit: 'kg', 
    pricePerUnit: 35, 
    icon: '🍚', 
    image: '/images/sugar.jpg',
    category: 'Condiments',
    increment: 1,
    stock: 1200,
    description: 'Fine white sugar'
  },
  { 
    id: 'oil', 
    name: 'Cooking Oil', 
    maxQty: 1, 
    unit: 'L', 
    pricePerUnit: 100, 
    icon: '🛢️', 
    image: '/images/oil.jpg',
    category: 'Oils',
    increment: 1,
    stock: 600,
    description: 'Refined cooking oil'
  },
  { 
    id: 'kerosene', 
    name: 'Kerosene', 
    maxQty: 1, 
    unit: 'L', 
    pricePerUnit: 40, 
    icon: '⛽', 
    image: '/images/kerosene.jpg',
    category: 'Fuel',
    increment: 1,
    stock: 400,
    description: 'PDS kerosene'
  },
  { 
    id: 'tea', 
    name: 'Tea Powder', 
    maxQty: 0.5, 
    unit: 'kg', 
    pricePerUnit: 250, 
    icon: '🍵', 
    image: '/images/tea.jpg',
    category: 'Beverages',
    increment: 0.25,
    stock: 300,
    description: 'Premium tea powder'
  }
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'upi-id', name: 'UPI ID', icon: '🔗', description: 'Direct UPI Payment' },
  { id: 'upi-apps', name: 'UPI Apps', icon: '📱', description: 'GPay/PhonePe/Paytm' },
  { id: 'debit-card', name: 'Debit Card', icon: '💳', description: 'Card Payment' },
  { id: 'credit-card', name: 'Credit Card', icon: '💳', description: 'Card Payment' },
  { id: 'cash', name: 'Cash', icon: '💵', description: 'Cash on Delivery' }
];

// Biometric Types
export const BIOMETRIC_TYPES = [
  { id: 'fingerprint', name: 'Fingerprint', icon: '👆', description: 'Scan your fingerprint for verification' },
  { id: 'face', name: 'Face Unlock', icon: '😀', description: 'Use facial recognition verification' }
];

// Modules
export const MODULES = {
  LOGIN: 1,
  FAMILY: 2,
  BIOMETRIC: 3,
  ITEMS: 4,
  CART: 5,
  RECEIPT: 6,
  ADMIN_LOGIN: 7,    // NEW
  ADMIN_DASHBOARD: 8 // NEW
};

// Delivery Status
export const DELIVERY_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DISPATCHED: 'dispatched',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Categories
export const CATEGORIES = [
  'All',
  'Grains',
  'Pulses',
  'Oils',
  'Condiments',
  'Fuel',
  'Beverages'
];