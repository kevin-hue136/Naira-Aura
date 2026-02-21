
export type Category = 'Electronics' | 'Vehicles' | 'Fashion' | 'Home & Garden' | 'Groceries' | 'Other';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  expiryDate?: string;
  purchaseDate?: string;
  condition: 'New' | 'Used';
  location: string;
  createdAt: string;
  isSold: boolean;
  sellerRating: number;
  sellerReviewCount: number;
  isVerified?: boolean;
  priceAnalysis?: string;
  reviews: Review[];
  trustVelocity?: number; // 0-100
}

export interface MarketRequest {
  id: string;
  userId: string;
  title: string;
  category: Category;
  timestamp: string;
  budget?: number;
}

export interface CartItem {
  product: Product;
  addedAt: string;
}

export interface Transaction {
  id: string;
  productId?: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: 'Escrow' | 'Released' | 'Refunded' | 'TopUp';
  timestamp: string;
  escrowFee: number;
  sellerPayout: number;
  type: 'Payment' | 'Funding';
  rated?: boolean;
  trackingStatus?: 'Pending' | 'In Transit' | 'Delivered';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  balance: number;
  notifications: AppNotification[];
  aiSettings: AiSettings;
  trustVelocity: number;
  totalEscrowTrades: number;
  auraPoints: number;
}

export interface AiSettings {
  voiceEnabled: boolean;
  voiceName: 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';
  personality: 'Friendly' | 'Formal';
}

export interface AppNotification {
  id: string;
  text: string;
  time: string;
  type: 'payment' | 'info' | 'success' | 'alert';
  read: boolean;
}

export interface DebtRecord {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
  notes: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  stockLevel: number;
  buyPrice: number;
  currentMarketValue: number;
  lastRestockDate: string;
  inflationImpact: number; // Percentage
}

export interface SmartContract {
  id: string;
  type: 'Trade' | 'Supply' | 'Service';
  parties: string;
  details: string;
  content: string;
  status: 'Draft' | 'Signed';
  createdAt: string;
}
