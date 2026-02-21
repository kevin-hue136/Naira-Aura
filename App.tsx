
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Marketplace } from './components/Marketplace';
import { ProductView } from './components/ProductView';
import { SellForm } from './components/SellForm';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { NotificationToast } from './components/NotificationToast';
import { NotificationCenter } from './components/NotificationCenter';
import { SettingsView } from './components/SettingsView';
import { CartDrawer } from './components/CartDrawer';
import { RequestView } from './components/RequestView';
import { AccountView } from './components/AccountView';
import { ChatSystem } from './components/ChatSystem';
import { Product, Transaction, Category, User, AppNotification, CartItem, AiSettings, MarketRequest } from './types';

const generateMockProducts = (): Product[] => {
  const productLibrary = {
    Electronics: [{ name: 'iPhone 15 Pro Max', kw: 'iphone-15', basePrice: 1650000 }],
    Vehicles: [{ name: '2020 Toyota Corolla', kw: 'corolla', basePrice: 14500000 }],
    Fashion: [{ name: 'Men\'s Designer Shoes', kw: 'shoes', basePrice: 85000 }],
    Groceries: [{ name: 'Rice Bag 50kg', kw: 'rice', basePrice: 78000 }]
  };

  const products: Product[] = [];
  let idCounter = 1;

  Object.entries(productLibrary).forEach(([category, items]) => {
    items.forEach((item) => {
      products.push({
        id: idCounter.toString(),
        sellerId: `user_${idCounter}`,
        title: item.name,
        description: `Premium quality ${item.name}. Secure with NAIRA AURA protocol. No off-platform maneuvers allowed.`,
        price: item.basePrice,
        category: category as Category,
        images: [`https://loremflickr.com/800/600/${item.kw}?lock=${idCounter}`],
        condition: 'New',
        location: 'Ikeja, Lagos',
        createdAt: new Date().toISOString(),
        isSold: false,
        sellerRating: 4.8,
        sellerReviewCount: 12,
        isVerified: true,
        reviews: [],
        trustVelocity: 85 + Math.floor(Math.random() * 15)
      });
      idCounter++;
    });
  });
  return products;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<MarketRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showChat, setShowChat] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);
  const [aiAssistantTrigger, setAiAssistantTrigger] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [user, setUser] = useState<User>({
    id: 'me',
    name: 'John Adebayo',
    email: 'john@example.com',
    phoneNumber: '+234 812 345 6789',
    balance: 5000000,
    notifications: [],
    aiSettings: { voiceEnabled: true, voiceName: 'Zephyr', personality: 'Friendly' },
    trustVelocity: 94,
    totalEscrowTrades: 42,
    auraPoints: 1250
  });

  useEffect(() => {
    setProducts(generateMockProducts());
  }, []);

  const handleUpdateProfile = (newData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...newData }));
    setActiveNotification({ id: Math.random().toString(), text: "Aura Identity Synced", type: 'success', time: 'Now', read: false });
    setTimeout(() => setActiveNotification(null), 2000);
  };

  const handleAddToCart = (product: Product) => {
    if (cart.find(item => item.product.id === product.id)) return;
    setCart(prev => [...prev, { product, addedAt: new Date().toISOString() }]);
    setActiveNotification({ id: Math.random().toString(), text: `Asset Locked in Cart`, type: 'success', time: 'Now', read: false });
    setTimeout(() => setActiveNotification(null), 2000);
  };

  const handleCreateRequest = (request: MarketRequest) => {
    setRequests([request, ...requests]);
    setActiveTab('hunt');
    setActiveNotification({ id: Math.random().toString(), text: `Broadcast Sent to Merchants`, type: 'info', time: 'Now', read: false });
    setTimeout(() => setActiveNotification(null), 2000);
  };

  const finalizePurchase = () => {
    if (!selectedProduct) return;
    const totalDeduction = selectedProduct.price * 1.005;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      productId: selectedProduct.id,
      buyerId: 'me',
      sellerId: selectedProduct.sellerId,
      amount: selectedProduct.price,
      status: 'Escrow',
      timestamp: new Date().toISOString(),
      escrowFee: selectedProduct.price * 0.005,
      sellerPayout: selectedProduct.price,
      type: 'Payment'
    };
    setTransactions([newTx, ...transactions]);
    const earnedPoints = Math.floor(selectedProduct.price / 10000); // 1 point per 10k Naira
    setUser(prev => ({ 
      ...prev, 
      balance: prev.balance - totalDeduction, 
      totalEscrowTrades: prev.totalEscrowTrades + 1,
      auraPoints: prev.auraPoints + earnedPoints
    }));
    setActiveNotification({ 
      id: Math.random().toString(), 
      text: `Protocol Success: +${earnedPoints} Aura Points`, 
      type: 'success', 
      time: 'Now', 
      read: false 
    });
    setShowPaymentModal(false);
    setSelectedProduct(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="relative">
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        userBalance={user.balance}
        unreadCount={user.notifications.length}
        cartCount={cart.length}
        onToggleNotifications={() => setShowNotificationCenter(!showNotificationCenter)}
        onToggleCart={() => setShowCartDrawer(!showCartDrawer)}
        theme={theme}
      >
        {activeTab !== 'account' && (
          <div className="mb-12 lg:mb-20 flex flex-col md:flex-row items-stretch gap-6 lg:gap-10">
            {/* Trust Velocity Gauge */}
            <div className="flex-1 bg-white/5 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                      <h1 className="text-[10px] lg:text-sm font-black text-emerald-500 uppercase tracking-[0.2em] lg:tracking-[0.3em]">Aura Trust Velocity</h1>
                    </div>
                    <span className="text-2xl lg:text-4xl font-black text-white">{user.trustVelocity}%</span>
                </div>
                <div className="w-full h-3 lg:h-4 bg-black rounded-full p-[2px] lg:p-[3px] border border-white/10 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-sky-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-[2000ms]" style={{width: `${user.trustVelocity}%`}}></div>
                </div>
                <div className="mt-6 lg:mt-8 flex justify-between items-center">
                    <p className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Trades: {user.totalEscrowTrades} • Status: Elite</p>
                    <span className="text-[8px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full border border-emerald-500/20">Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Balance */}
            <div className="md:w-1/3 bg-[#0D0D0F] rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 border border-white/5 flex flex-col justify-center shadow-2xl">
                <span className="text-[9px] lg:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] lg:tracking-[0.3em] block mb-2 lg:mb-4">Wallet Vault</span>
                <p className="text-2xl lg:text-4xl font-black text-white tracking-tighter tabular-nums">₦{user.balance.toLocaleString()}</p>
                <div className="mt-4 lg:mt-8 h-1 w-10 lg:w-12 bg-emerald-500/30 rounded-full"></div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <Marketplace 
            products={products} 
            onProductClick={setSelectedProduct} 
            onBuyNow={(p) => {setSelectedProduct(p); setShowPaymentModal(true);}}
            onAddToCart={handleAddToCart}
            searchTerm={searchTerm} 
            categoryFilter={'All'} 
            conditionFilter={'All'}
            onOpenVault={() => setActiveTab('dashboard')}
            onLearnMore={() => setAiAssistantTrigger(prev => prev + 1)}
          />
        )}
        {activeTab === 'hunt' && (
          <RequestView 
            requests={requests} 
            onSubmit={handleCreateRequest}
          />
        )}
        {activeTab === 'account' && (
          <AccountView 
            user={user} 
            onUpdateProfile={handleUpdateProfile}
            onUpgradeVerification={() => {
              setActiveNotification({ id: Math.random().toString(), text: "Upgrade Request Logged", type: 'info', time: 'Now', read: false });
              setTimeout(() => setActiveNotification(null), 2000);
            }} 
          />
        )}
        {activeTab === 'sell' && <SellForm onSubmit={(p) => {setProducts([{...p, reviews: []}, ...products]); setActiveTab('market');}} />}
        {activeTab === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            products={products} 
            onConfirmReceipt={(id) => setTransactions(transactions.map(t => t.id === id ? {...t, status: 'Released'} : t))} 
            onRateProduct={()=>{}}
            user={user}
            onTopUp={(amt) => setUser(p => ({...p, balance: p.balance + amt}))}
            onWithdraw={(amt) => setUser(p => ({...p, balance: p.balance - amt}))}
            onExportLedger={() => {
               setActiveNotification({ id: Math.random().toString(), text: "CSV Ledger Exporting...", type: 'info', time: 'Now', read: false });
               setTimeout(() => {
                 setActiveNotification(null);
                 alert("Vault Export Successful: CSV data is ready.");
               }, 2000);
            }}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsView user={user} onUpdateProfile={handleUpdateProfile} theme={theme} setTheme={() => {}} onUpdateAiSettings={() => {}} />
        )}
        
        {selectedProduct && !showPaymentModal && (
          <ProductView 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onPurchase={(p) => {setSelectedProduct(p); setShowPaymentModal(true);}}
            onAddToCart={handleAddToCart}
            onContactMerchant={() => setShowChat(selectedProduct)}
          />
        )}
        
        {showChat && (
          <ChatSystem 
            product={showChat} 
            onClose={() => setShowChat(null)}
            onPenalty={(penalty) => {
              setUser(prev => ({ ...prev, trustVelocity: Math.max(0, prev.trustVelocity - penalty) }));
              setActiveNotification({ 
                id: Math.random().toString(), 
                text: "Aura Integrity Violation: Trust Velocity Penalized", 
                type: 'alert', 
                time: 'Now', 
                read: false 
              });
            }}
          />
        )}
        
        {showPaymentModal && selectedProduct && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowPaymentModal(false)} />
            <div className="relative bg-[#0D0D0F] w-full max-w-md rounded-[3rem] p-14 text-center animate-in zoom-in border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
              <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] mx-auto flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                 <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Secure Flow</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-12">AuraEscrow Active</p>
              
              <div className="bg-white/5 p-8 rounded-3xl mb-12 space-y-6 text-left border border-white/5">
                <div className="flex justify-between font-black">
                   <span className="text-slate-500 text-[10px] uppercase tracking-widest">Asset Value</span>
                   <span className="text-white">₦{selectedProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black">
                   <span className="text-slate-500 text-[10px] uppercase tracking-widest">Nodes Fee (0.5%)</span>
                   <span className="text-emerald-500">₦{(selectedProduct.price * 0.005).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={finalizePurchase} className="w-full bg-emerald-500 text-black font-black py-6 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest">Initiate Protocol</button>
              <p className="mt-8 text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">Staying on-platform is the only way to avoid the "maneuvers". Protect your capital.</p>
            </div>
          </div>
        )}
      </Layout>

      {showNotificationCenter && <NotificationCenter notifications={user.notifications} onClose={() => setShowNotificationCenter(false)} />}
      {showCartDrawer && <CartDrawer items={cart} isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} onRemove={(id) => setCart(c => c.filter(i => i.product.id !== id))} onCheckout={() => setShowCartDrawer(false)} userBalance={user.balance} theme={theme} />}

      <NotificationToast notification={activeNotification} onClose={() => setActiveNotification(null)} />
      <AIAssistant externalTrigger={aiAssistantTrigger} aiSettings={user.aiSettings} />
    </div>
  );
};

export default App;
