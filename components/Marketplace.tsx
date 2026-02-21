
import React, { useState } from 'react';
import { Product, Category } from '../types';

interface MarketplaceProps {
  products: Product[];
  onProductClick: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  searchTerm: string;
  categoryFilter: Category | 'All';
  conditionFilter: 'All' | 'New' | 'Used';
  onOpenVault: () => void;
  onLearnMore: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  products, 
  onProductClick, 
  onBuyNow,
  onAddToCart,
  searchTerm, 
  categoryFilter, 
  conditionFilter,
  onOpenVault,
  onLearnMore
}) => {
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesCondition = conditionFilter === 'All' || p.condition === conditionFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = !showVerifiedOnly || p.isVerified;
    return matchesCategory && matchesCondition && matchesSearch && matchesVerified && !p.isSold;
  });

  return (
    <div className="space-y-12 lg:space-y-32 animate-in fade-in duration-1000">
      {/* Dynamic Hero Banner */}
      <div className="relative h-[400px] lg:h-[560px] rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden group border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/60 via-sky-500/20 to-[#050505] transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.3),transparent_70%)] animate-pulse"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-24 text-white max-w-5xl z-10">
          <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-12">
             <div className="w-12 lg:w-16 h-1 lg:h-1.5 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"></div>
             <span className="text-[10px] lg:text-sm font-black uppercase tracking-[0.4em] lg:tracking-[0.8em] text-emerald-400">Digital Aura Protocol</span>
          </div>
          <h2 className="text-5xl lg:text-9xl font-black mb-6 lg:mb-12 leading-[0.85] tracking-tighter">NAIRA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">AURA.</span></h2>
          <p className="text-slate-300 text-sm lg:text-2xl font-medium opacity-90 leading-relaxed max-w-2xl mb-8 lg:mb-16">
            Access the premier secure exchange. Protected by cryptographic escrow nodes.
          </p>
          <div className="flex flex-wrap gap-4 lg:gap-8">
             <button onClick={onOpenVault} className="bg-emerald-500 text-black px-8 lg:px-12 py-4 lg:py-6 rounded-[1.5rem] lg:rounded-[2.5rem] font-black text-[10px] lg:text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95">Enter Vault</button>
             <button onClick={() => setShowManifesto(true)} className="bg-white/5 backdrop-blur-2xl border border-white/10 px-8 lg:px-12 py-4 lg:py-6 rounded-[1.5rem] lg:rounded-[2.5rem] font-black text-[10px] lg:text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">Manifesto</button>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 lg:bottom-16 lg:right-16 flex flex-col gap-6 z-10">
           <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-2xl text-right">
              <p className="text-[9px] lg:text-[11px] font-black text-emerald-500 uppercase mb-1 lg:mb-3 tracking-[0.4em]">Protocol TVL</p>
              <p className="text-2xl lg:text-4xl font-black tracking-tighter tabular-nums text-white">₦51.2B</p>
           </div>
        </div>
      </div>

      {showManifesto && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowManifesto(false)}></div>
           <div className="relative bg-[#1A1C20] w-full max-w-2xl p-16 rounded-[4rem] border border-white/10 shadow-2xl">
              <button onClick={() => setShowManifesto(false)} className="absolute top-12 right-12 p-4 bg-white/5 rounded-2xl text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-4xl font-black text-white mb-10 tracking-tighter">The Aura Protocol Manifesto</h3>
              <div className="space-y-8 text-slate-400 font-medium leading-loose">
                 <p>1. <span className="text-emerald-500 font-black">Capital Integrity</span>: No user shall be exposed to risk. Escrow nodes act as the final authority on settlement.</p>
                 <p>2. <span className="text-emerald-500 font-black">Verified Merchant Nodes</span>: Every merchant on Aura is cross-referenced with local banking data. Scams are statistically impossible.</p>
                 <p>3. <span className="text-emerald-500 font-black">No Off-Platform Maneuvers</span>: The Aura is absolute. Maneuvering outside protocol voids protection.</p>
                 <p>4. <span className="text-emerald-500 font-black">NairaIntelligence™</span>: AI assists but users decide. We empower local traders with institutional-grade tech.</p>
              </div>
              <button onClick={() => setShowManifesto(false)} className="w-full mt-12 py-6 bg-emerald-500 text-black font-black rounded-3xl uppercase tracking-widest">Understood</button>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 lg:gap-16 px-2 lg:px-4">
        <div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-white">Live Aura.</h2>
          <p className="text-[10px] lg:text-xs font-black text-emerald-500/60 mt-4 lg:mt-6 uppercase tracking-[0.5em]">{filteredProducts.length} Verified Assets Online</p>
        </div>
        
        <div className="flex gap-3 lg:gap-6 p-2 lg:p-3 bg-white/5 rounded-[1.5rem] lg:rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-xl overflow-x-auto no-scrollbar">
           <button onClick={() => setShowVerifiedOnly(false)} className={`px-6 lg:px-12 py-3 lg:py-5 rounded-xl lg:rounded-2xl text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!showVerifiedOnly ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:text-white'}`}>Latest Drops</button>
           <button onClick={() => setShowVerifiedOnly(true)} className={`px-6 lg:px-12 py-3 lg:py-5 rounded-xl lg:rounded-2xl text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${showVerifiedOnly ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'text-slate-500 hover:text-white'}`}>Elite Status</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-16 px-2 lg:px-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            onClick={() => onProductClick(product)}
            className="group relative bg-[#0D0D0F] rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-emerald-500/40 hover:shadow-[0_50px_100px_rgba(0,0,0,0.9)] transition-all duration-700 cursor-pointer flex flex-col h-[600px] lg:h-[700px]"
          >
            <div className="h-[300px] lg:h-[360px] relative overflow-hidden bg-[#050505] p-4 lg:p-8">
              <div className="w-full h-full rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden bg-white/5 shadow-inner">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" />
              </div>
              <div className="absolute top-8 lg:top-12 left-8 lg:left-12">
                <div className="bg-black/70 backdrop-blur-xl px-4 lg:px-5 py-2 lg:2.5 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30">
                  {product.condition}
                </div>
              </div>
              {product.isVerified && (
                <div className="absolute top-8 lg:top-12 right-8 lg:right-12 w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_25px_#10b981] group-hover:rotate-[360deg] transition-transform duration-1000">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.061 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" /></svg>
                </div>
              )}
            </div>
            
            <div className="p-8 lg:p-12 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4 lg:mb-8">
                <span className="text-[9px] lg:text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">{product.category}</span>
                <span className="text-[9px] lg:text-[11px] font-black text-slate-600 uppercase tracking-widest">{product.location.split(',')[0]}</span>
              </div>
              <h3 className="text-xl lg:text-3xl font-black text-white mb-4 lg:mb-6 line-clamp-1 group-hover:text-emerald-500 transition-colors tracking-tight">{product.title}</h3>
              <p className="text-xs lg:text-sm text-slate-500 line-clamp-2 mb-6 lg:mb-10 flex-1 font-medium leading-relaxed opacity-80">{product.description}</p>
              
              <div className="pt-6 lg:pt-10 border-t border-white/10 mb-6 lg:mb-10">
                 <p className="text-[9px] lg:text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2 lg:mb-3">Escrow Value</p>
                 <span className="text-2xl lg:text-4xl font-black text-white tracking-tighter">₦{product.price.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                 <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="py-4 lg:py-5 border border-white/10 text-white font-black text-[10px] lg:text-[11px] rounded-[1.2rem] lg:rounded-[1.5rem] uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95">Cart</button>
                 <button onClick={(e) => { e.stopPropagation(); onBuyNow(product); }} className="py-4 lg:py-5 bg-emerald-500 text-black font-black text-[10px] lg:text-[11px] rounded-[1.2rem] lg:rounded-[1.5rem] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all active:scale-95">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
