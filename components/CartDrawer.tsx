
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  userBalance: number;
  theme: 'light' | 'dark';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  items, 
  isOpen, 
  onClose, 
  onRemove, 
  onCheckout, 
  userBalance,
  theme 
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price, 0);
  const fee = subtotal * 0.005;
  const total = subtotal + fee;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-[#0D0E10]/80 backdrop-blur-md" onClick={onClose} />
      
      <div className={`relative w-full lg:max-w-md h-full shadow-[0_0_100px_rgba(0,0,0,0.9)] border-l flex flex-col animate-in slide-in-from-right-full duration-500 ${theme === 'dark' ? 'bg-[#1A1C20] border-white/10' : 'bg-white border-slate-200'}`}>
        <div className={`p-6 lg:p-8 border-b flex items-center justify-between ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`}>
          <div>
            <h2 className={`text-xl lg:text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Secure Cart</h2>
            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Ready for Escrow Lock</p>
          </div>
          <button onClick={onClose} className={`p-2.5 lg:p-3 rounded-xl lg:rounded-2xl transition-all border ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
               <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-3xl mb-6 grayscale opacity-50">🛒</div>
               <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Your cart is empty</p>
               <p className={`text-xs mt-2 px-8 font-medium ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
                 NairaIntelligence Tip: Adding verified assets to your cart secures your interest before the next macro shift.
               </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className={`p-4 rounded-3xl border group transition-all relative ${theme === 'dark' ? 'bg-[#0D0E10] border-white/5 hover:border-emerald-500/20' : 'bg-slate-50 border-slate-200 hover:border-emerald-500/20'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black shrink-0">
                    <img src={item.product.images[0]} className="w-full h-full object-cover" alt={item.product.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-black truncate tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{item.product.title}</h4>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">₦{item.product.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => onRemove(item.product.id)}
                    className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={`p-6 lg:p-8 border-t ${theme === 'dark' ? 'bg-[#0D0E10] border-white/10' : 'bg-slate-50 border-slate-100'}`}>
             <div className="space-y-3 mb-6 lg:mb-8">
               <div className="flex justify-between text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">
                 <span>Subtotal</span>
                 <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>₦{subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">
                 <span>Escrow Fee (0.5%)</span>
                 <span className="text-emerald-500">₦{fee.toLocaleString()}</span>
               </div>
               <div className={`h-px my-3 lg:my-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`} />
               <div className="flex justify-between items-center">
                 <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Total Settlement</span>
                 <span className={`text-xl lg:text-2xl font-black tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₦{total.toLocaleString()}</span>
               </div>
             </div>

             <div className="space-y-3 lg:space-y-4">
               {userBalance < total && (
                 <div className="p-2.5 lg:p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[8px] lg:text-[9px] font-black text-red-500 uppercase text-center tracking-widest">
                   Insufficient Balance
                 </div>
               )}
               <button 
                onClick={onCheckout}
                disabled={userBalance < total}
                className="w-full bg-emerald-600 disabled:bg-slate-700 text-white font-black py-4 lg:py-5 rounded-xl lg:rounded-2xl shadow-2xl shadow-emerald-900/40 text-[10px] lg:text-xs uppercase tracking-widest active:scale-95 transition-all border border-emerald-500/20"
               >
                 Execute Bulk Escrow
               </button>
               <button onClick={onClose} className="w-full text-[9px] lg:text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-emerald-500 transition-colors">
                 Continue Trading
               </button>
             </div>
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};
