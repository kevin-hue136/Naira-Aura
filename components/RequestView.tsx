
import React, { useState } from 'react';
import { Category, MarketRequest } from '../types';

interface RequestViewProps {
  requests: MarketRequest[];
  onSubmit: (request: MarketRequest) => void;
}

export const RequestView: React.FC<RequestViewProps> = ({ requests, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics' as Category,
    budget: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newRequest: MarketRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'me',
      title: formData.title,
      category: formData.category,
      timestamp: new Date().toISOString(),
      budget: formData.budget ? parseFloat(formData.budget) : undefined
    };

    onSubmit(newRequest);
    setFormData({ title: '', category: 'Electronics', budget: '' });
  };

  return (
    <div className="space-y-12 lg:space-y-24 animate-in fade-in duration-700 pb-20 px-2">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-4 lg:mb-6">Broadcast Your Need.</h2>
        <p className="text-slate-500 text-sm lg:text-xl font-medium tracking-tight">Ping 14,000+ verified merchants instantly.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-[#1A1C20] p-8 lg:p-16 rounded-[2.5rem] lg:rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-12">
            <div className="space-y-8 lg:space-y-10">
              <div>
                <label className="block text-[10px] lg:text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] mb-3 lg:mb-4">I'm Hunting For...</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vintage 1970s Jacket" 
                  className="w-full bg-black/40 border border-white/10 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] px-8 lg:px-10 text-base lg:text-lg font-black text-white outline-none focus:border-amber-500/50 shadow-inner transition-all placeholder:text-slate-700"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <label className="block text-[10px] lg:text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] mb-3 lg:mb-4">Category</label>
                  <select 
                    className="w-full bg-black/40 border border-white/10 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] px-8 lg:px-10 text-xs lg:text-sm font-black text-white outline-none appearance-none cursor-pointer hover:bg-black/60 transition-all"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  >
                    <option>Electronics</option>
                    <option>Vehicles</option>
                    <option>Fashion</option>
                    <option>Home & Garden</option>
                    <option>Groceries</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] lg:text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] mb-3 lg:mb-4">Max Budget (₦)</label>
                  <input 
                    type="number" 
                    placeholder="Optional" 
                    className="w-full bg-black/40 border border-white/10 p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] px-8 lg:px-10 text-base lg:text-lg font-black text-white outline-none focus:border-emerald-500/50 shadow-inner transition-all placeholder:text-slate-700"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-amber-500 text-black font-black py-6 lg:py-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-[0_20px_60px_rgba(245,158,11,0.3)] text-xs lg:text-sm uppercase tracking-[0.4em] active:scale-95 transition-all hover:scale-[1.02]"
            >
              Broadcast Signal
            </button>
          </form>
          
          <p className="mt-12 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
            Your identity remains masked until a verified merchant responds with an AuraEscrow offer.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        <h3 className="text-3xl font-black text-white ml-4 tracking-tighter">Active Network Hunts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {requests.length === 0 ? (
             <div className="col-span-full py-32 bg-white/5 border border-dashed border-white/10 rounded-[3rem] text-center">
                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">No active public hunts detected in your sector.</p>
             </div>
           ) : (
             requests.map(req => (
               <div key={req.id} className="bg-[#1A1C20] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8">
                     <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shadow-[0_0_10px_#f59e0b]"></div>
                  </div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] block mb-4">{req.category}</span>
                  <h4 className="text-2xl font-black text-white mb-6 group-hover:text-amber-500 transition-colors">{req.title}</h4>
                  <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-auto">
                     <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Budget</p>
                        <p className="text-lg font-black text-white">₦{req.budget?.toLocaleString() || 'Flexible'}</p>
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase">{new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};
