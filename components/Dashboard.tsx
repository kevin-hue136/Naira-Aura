
import React, { useState } from 'react';
import { Transaction, Product, User, Review } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
  onConfirmReceipt: (txId: string) => void;
  onRateProduct: (txId: string, productId: string, rating: number, comment: string) => void;
  user: User;
  onTopUp: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onExportLedger: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  products, 
  onConfirmReceipt, 
  onRateProduct, 
  user, 
  onTopUp,
  onWithdraw,
  onExportLedger
}) => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState<{txId: string, productId: string} | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const totalSales = transactions.filter(t => t.status === 'Released' && t.type === 'Payment' && t.sellerId === 'me').reduce((acc, t) => acc + t.amount, 0);

  const handleTopUpSubmit = () => {
    const amt = parseFloat(topUpAmount);
    if (amt > 0) {
      onTopUp(amt);
      setShowTopUp(false);
      setTopUpAmount('');
    }
  };

  const handleWithdrawSubmit = () => {
    const amt = parseFloat(withdrawAmount);
    if (amt > 0) {
      onWithdraw(amt);
      setShowWithdraw(false);
      setWithdrawAmount('');
    }
  };

  const submitRating = () => {
    if (showRatingModal) {
      onRateProduct(showRatingModal.txId, showRatingModal.productId, rating, comment);
      setShowRatingModal(null);
      setRating(5);
      setComment('');
    }
  };

  const paymentMethods = [
    { name: 'OPay', icon: '🟢', color: 'bg-[#00c071]' },
    { name: 'PalmPay', icon: '🔴', color: 'bg-[#910a0e]' },
    { name: 'MTN MoMo', icon: '🟡', color: 'bg-[#ffcc00]' },
    { name: 'Paga', icon: '🔵', color: 'bg-[#1a2b5a]' }
  ];

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 pb-20 px-0 lg:px-2">
      {/* Wallet Header */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="lg:w-2/3 bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 md:p-12 rounded-[2.5rem] lg:rounded-3xl shadow-2xl relative overflow-hidden text-white border border-white/20">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8 md:mb-16">
              <div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-1 md:mb-2">Wallet Vault</p>
                <h3 className="text-[10px] md:text-sm font-bold opacity-90 tracking-tight">{user.phoneNumber}</h3>
              </div>
              <div className="px-3 md:px-6 py-1.5 md:py-3 bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 text-[7px] md:text-[10px] font-black uppercase tracking-widest">
                Tier 3 Merchant
              </div>
            </div>
            <div className="mb-8 md:mb-16">
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-60 mb-2 md:mb-3">Escrow Balance</p>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter tabular-nums overflow-hidden whitespace-nowrap overflow-ellipsis drop-shadow-2xl">₦{user.balance.toLocaleString()}</h2>
            </div>
            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={() => setShowTopUp(true)}
                className="flex-1 lg:flex-none px-4 md:px-10 py-3.5 md:py-5 bg-white text-emerald-800 font-black rounded-xl lg:rounded-2xl text-[8px] md:text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all active:scale-95 border border-white/20"
              >
                Fund Wallet
              </button>
              <button 
                onClick={() => setShowWithdraw(true)}
                className="flex-1 lg:flex-none px-4 md:px-10 py-3.5 md:py-5 bg-white/10 border border-white/20 text-white font-black rounded-xl lg:rounded-2xl text-[8px] md:text-[11px] uppercase tracking-[0.2em] backdrop-blur-xl hover:bg-white/20 transition-all active:scale-95"
              >
                Withdrawal
              </button>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-10 right-10 opacity-5 text-[8rem] md:text-[15rem] font-black select-none pointer-events-none">₦</div>
        </div>

        <div className="lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8">
           <div className="bg-[#1A1C20] p-6 lg:p-10 rounded-[2rem] lg:rounded-3xl border border-white/10 flex flex-col justify-center shadow-xl">
             <p className="text-slate-500 text-[7px] lg:text-[10px] font-black uppercase tracking-widest mb-2 lg:mb-4">Security Protocol</p>
             <div className="text-xl lg:text-4xl font-black text-white tracking-tighter">AES-256</div>
             <p className="text-[7px] lg:text-[10px] font-medium text-slate-400 mt-1 lg:mt-2">Encrypted trades.</p>
           </div>
           <div className="bg-[#1A1C20] p-6 lg:p-10 rounded-[2rem] lg:rounded-3xl border border-white/10 flex flex-col justify-center shadow-xl overflow-hidden">
             <p className="text-slate-500 text-[7px] lg:text-[10px] font-black uppercase tracking-widest mb-2 lg:mb-4">Aura Points</p>
             <div className="text-lg lg:text-3xl font-black text-amber-500 tracking-tighter tabular-nums overflow-hidden overflow-ellipsis">{user.auraPoints.toLocaleString()}</div>
             <p className="text-[7px] lg:text-[10px] font-medium text-slate-400 mt-1 lg:mt-2">Redeemable for protocol boosts.</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 lg:gap-6 px-2 lg:px-0">
        <div>
          <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-white">Asset Pipeline</h2>
          <p className="text-[10px] lg:text-sm font-bold text-slate-500 mt-1 lg:mt-2 uppercase tracking-[0.2em]">Escrow history</p>
        </div>
        <button 
          onClick={onExportLedger} 
          className="w-full lg:w-auto px-6 lg:px-8 py-3 lg:py-4 bg-white/5 text-slate-400 border border-white/10 font-black rounded-xl lg:rounded-2xl hover:text-white hover:bg-white/10 transition-all uppercase text-[8px] lg:text-[10px] tracking-widest active:scale-95"
        >
          Export Ledger
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#1A1C20] rounded-[2rem] lg:rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[600px] lg:min-w-full">
            <thead className="bg-[#0D0E10] text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-slate-500 border-b border-white/10">
              <tr>
                <th className="px-6 lg:px-12 py-4 lg:py-8">Asset / Ref</th>
                <th className="px-6 lg:px-12 py-4 lg:py-8">Capital Flow</th>
                <th className="px-6 lg:px-12 py-4 lg:py-8">Classification</th>
                <th className="px-6 lg:px-12 py-4 lg:py-8">State</th>
                <th className="px-6 lg:px-12 py-4 lg:py-8 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-12 py-24 lg:py-32 text-center text-slate-600 font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs">No activity in pipeline</td></tr>
              ) : (
                transactions.map(tx => {
                  const product = products.find(p => p.id === tx.productId);
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-all duration-300">
                      <td className="px-6 lg:px-12 py-4 lg:py-8">
                        {tx.type === 'Funding' ? (
                          <div className="flex items-center gap-3 lg:gap-5">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-xs lg:text-base shadow-inner border border-emerald-500/10">📥</div>
                            <span className="font-black text-[10px] lg:text-sm text-white tracking-tight">Top Up</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 lg:gap-5">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-[#0D0E10] overflow-hidden border border-white/10 shadow-inner">
                              {product && <img src={product.images[0]} className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-black text-[10px] lg:text-sm text-white truncate max-w-[100px] lg:max-w-[200px] tracking-tight">{product?.title || 'System Asset'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 lg:px-12 py-4 lg:py-8">
                        <div className="flex flex-col">
                          <span className={`font-black text-sm lg:text-lg tracking-tighter tabular-nums ${tx.type === 'Funding' ? 'text-emerald-500' : 'text-white'}`}>
                            {tx.type === 'Funding' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                          </span>
                          {tx.escrowFee > 0 && <span className="text-[7px] lg:text-[9px] text-slate-600 font-bold uppercase tracking-tight tabular-nums">Fee: ₦{tx.escrowFee.toLocaleString()}</span>}
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-4 lg:py-8 text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500">{tx.type}</td>
                      <td className="px-6 lg:px-12 py-4 lg:py-8">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 lg:px-4 py-1 lg:py-2 rounded-xl lg:rounded-2xl text-[7px] lg:text-[9px] font-black uppercase tracking-tight border w-fit ${
                            tx.status === 'Escrow' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 
                            tx.status === 'Released' || tx.status === 'TopUp' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {tx.status}
                          </span>
                          {tx.type === 'Payment' && (
                            <span className="text-[7px] lg:text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                              <div className={`w-1 h-1 rounded-full ${tx.trackingStatus === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              {tx.trackingStatus || 'Processing'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 lg:px-12 py-4 lg:py-8 text-right">
                        {tx.status === 'Escrow' && tx.sellerId !== 'me' ? (
                          <button onClick={() => onConfirmReceipt(tx.id)} className="px-3 lg:px-6 py-1.5 lg:py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[7px] lg:text-[9px] rounded-xl lg:rounded-2xl uppercase tracking-widest shadow-xl transition-all active:scale-95 border border-emerald-500/20">
                            Release
                          </button>
                        ) : tx.status === 'Released' && tx.type === 'Payment' && tx.buyerId === 'me' && !tx.rated ? (
                          <button onClick={() => setShowRatingModal({txId: tx.id, productId: tx.productId!})} className="px-3 lg:px-6 py-1.5 lg:py-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-[7px] lg:text-[9px] rounded-xl lg:rounded-2xl uppercase tracking-widest shadow-xl transition-all active:scale-95 border border-sky-500/20">
                            Review
                          </button>
                        ) : tx.status === 'Released' && tx.rated ? (
                          <span className="text-[8px] lg:text-[10px] font-black text-slate-600 uppercase tracking-widest">Feedback</span>
                        ) : null}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals... */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D0E10]/95 backdrop-blur-xl" onClick={() => setShowRatingModal(null)} />
          <div className="relative bg-[#1A1C20] w-full max-w-lg rounded-3xl p-10 md:p-12 border border-white/20 shadow-2xl animate-in zoom-in duration-300">
             <div className="text-center mb-8 md:mb-10">
               <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Merchant Feedback</span>
               <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Rate Your Trade</h3>
             </div>
             
             <div className="flex justify-center gap-2 md:gap-3 mb-10 md:mb-12">
               {[1, 2, 3, 4, 5].map((s) => (
                 <button key={s} onClick={() => setRating(s)} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all border ${s <= rating ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-110 border-emerald-400' : 'bg-white/5 text-slate-700 border-white/10'}`}>
                   <svg className="w-6 h-6 md:w-8 md:h-8 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                 </button>
               ))}
             </div>

             <div className="space-y-6 mb-10 md:mb-12">
               <textarea 
                placeholder="How was the quality and business experience? (Professional feedback encouraged)" 
                className="w-full p-6 md:p-8 rounded-3xl bg-[#0D0E10] border border-white/10 outline-none text-white font-medium text-xs md:text-sm focus:border-emerald-500/50 resize-none h-32 md:h-40 tracking-tight" 
                value={comment} 
                onChange={e => setComment(e.target.value)} 
               />
             </div>

             <button onClick={submitRating} className="w-full bg-emerald-600 text-white font-black py-5 md:py-6 rounded-2xl shadow-2xl shadow-emerald-900/40 text-[11px] md:text-sm uppercase tracking-widest active:scale-95 transition-all border border-emerald-500/20">
               Submit Verified Review
             </button>
          </div>
        </div>
      )}

      {showTopUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D0E10]/95 backdrop-blur-xl" onClick={() => setShowTopUp(false)} />
          <div className="relative bg-[#1A1C20] w-full max-w-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl animate-in zoom-in duration-300">
             <div className="text-center mb-8 md:mb-10">
               <span className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Liquidity Funding</span>
               <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Top Up Wallet</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
               {paymentMethods.map(m => (
                 <button key={m.name} className="flex items-center gap-2 md:gap-3 p-4 md:p-5 bg-[#0D0E10] border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all text-left group overflow-hidden">
                   <div className={`w-8 h-8 md:w-10 md:h-10 ${m.color} rounded-xl flex items-center justify-center text-xs md:text-sm shadow-lg group-hover:scale-110 transition-transform shrink-0`}>{m.icon}</div>
                   <span className="text-[8px] md:text-[10px] font-black uppercase text-white truncate">{m.name}</span>
                 </button>
               ))}
             </div>

             <div className="space-y-6 mb-10 md:mb-12">
               <div className="relative group">
                 <input 
                  type="number" 
                  placeholder="₦ Amount" 
                  className="w-full p-5 md:p-6 rounded-2xl px-8 md:px-10 bg-[#0D0E10] border border-white/10 outline-none text-white font-black text-xl md:text-2xl focus:border-emerald-500/50 shadow-inner tabular-nums tracking-tighter" 
                  value={topUpAmount} 
                  onChange={e => setTopUpAmount(e.target.value)} 
                 />
                 <span className="absolute right-6 md:right-8 top-6 md:top-7 text-emerald-500 font-black text-[9px] md:text-xs uppercase tracking-widest">NGN</span>
               </div>
             </div>

             <button onClick={handleTopUpSubmit} className="w-full bg-emerald-600 text-white font-black py-5 md:py-6 rounded-2xl shadow-2xl shadow-emerald-900/40 text-[11px] md:text-sm uppercase tracking-widest active:scale-95 transition-all border border-emerald-500/20">
               Execute Funding
             </button>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D0E10]/95 backdrop-blur-xl" onClick={() => setShowWithdraw(false)} />
          <div className="relative bg-[#1A1C20] w-full max-w-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl animate-in zoom-in duration-300">
             <div className="text-center mb-8 md:mb-10">
               <span className="text-[9px] md:text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] mb-4 block">Asset Liquidation</span>
               <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Withdraw Funds</h3>
             </div>
             
             <div className="space-y-6 mb-10 md:mb-12">
               <div className="p-5 md:p-6 bg-[#0D0E10] border border-white/10 rounded-2xl">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase mb-2">Available for payout</p>
                  <p className="text-xl md:text-2xl font-black text-white tabular-nums tracking-tighter">₦{user.balance.toLocaleString()}</p>
               </div>
               <div className="relative group">
                 <input 
                  type="number" 
                  placeholder="₦ Amount" 
                  className="w-full p-5 md:p-6 rounded-2xl px-8 md:px-10 bg-[#0D0E10] border border-white/10 outline-none text-white font-black text-xl md:text-2xl focus:border-sky-500/50 shadow-inner tabular-nums tracking-tighter" 
                  value={withdrawAmount} 
                  onChange={e => setWithdrawAmount(e.target.value)} 
                 />
                 <span className="absolute right-6 md:right-8 top-6 md:top-7 text-sky-500 font-black text-[9px] md:text-xs uppercase tracking-widest">NGN</span>
               </div>
             </div>

             <button onClick={handleWithdrawSubmit} className="w-full bg-sky-600 text-white font-black py-5 md:py-6 rounded-2xl shadow-2xl shadow-sky-900/40 text-[11px] md:text-sm uppercase tracking-widest active:scale-95 transition-all border border-sky-500/20">
               Transfer to Linked Bank
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
