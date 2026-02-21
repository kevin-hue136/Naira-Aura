
import React, { useState } from 'react';
import { Category } from '../types';

interface RequestModalProps {
  onClose: () => void;
  onSubmit: (title: string, category: string) => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0D0E10]/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-[#1A1C20] w-full max-w-lg rounded-3xl p-12 border border-white/20 shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all border border-white/10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-amber-500/20 shadow-xl">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Broadcast Request</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Alert all verified merchants</p>
        </div>

        <div className="space-y-8 mb-12">
          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-3">What are you looking for?</label>
            <input 
              type="text" 
              placeholder="e.g. Vintage Rolex or 2024 GPU..." 
              className="w-full p-6 rounded-2xl bg-[#0D0E10] border border-white/10 outline-none text-white font-bold placeholder:text-slate-700 focus:border-amber-500/50 shadow-inner" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-3">Asset Category</label>
            <select 
              className="w-full p-6 rounded-2xl bg-[#0D0E10] border border-white/10 outline-none text-white font-black appearance-none cursor-pointer"
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
            >
              <option>Electronics</option>
              <option>Vehicles</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Groceries</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => title && onSubmit(title, category)}
          className="w-full bg-amber-500 text-black font-black py-6 rounded-2xl shadow-2xl shadow-amber-900/40 text-sm uppercase tracking-widest active:scale-95 transition-all border border-amber-400/30"
        >
          Send Marketplace Ping
        </button>
        
        <p className="text-[10px] text-slate-500 text-center mt-6 font-bold leading-relaxed px-4 opacity-60">
          This will notify 14,000+ verified NairaMart merchants immediately. Your contact details remain hidden until you choose to trade.
        </p>
      </div>
    </div>
  );
};
