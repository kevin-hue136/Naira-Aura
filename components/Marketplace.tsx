
import React, { useState, useEffect } from 'react';
import { Product, Category, MarketRequest } from '../types';
import { predictMarketTrends } from '../services/geminiService';

interface MarketplaceProps {
  products: Product[];
  requests: MarketRequest[];
  onProductClick: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  searchTerm: string;
  categoryFilter: Category | 'All';
  conditionFilter: 'All' | 'New' | 'Used';
  onOpenVault: () => void;
  onLearnMore: () => void;
}

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Anambra', 
  'Delta', 'Edo', 'Kaduna', 'Kwara', 'Ogun', 'Osun', 'Abia', 'Akwa Ibom', 
  'Cross River', 'Imo', 'Plateau'
];

const POPULAR_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'HP', 'Toyota', 'Honda', 'Nike', 'Gucci', 'Dangote', 'Mama Gold'
];

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  products, 
  requests,
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
  const [trends, setTrends] = useState<{title: string, prediction: string, confidence: number}[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // Filter popup states
  const [showFilters, setShowFilters] = useState(false);
  const [tempLocation, setTempLocation] = useState('All');
  const [tempCondition, setTempCondition] = useState('All');
  const [tempBrand, setTempBrand] = useState('All');
  const [tempCategory, setTempCategory] = useState('All');

  const [activeLocation, setActiveLocation] = useState('All');
  const [activeCondition, setActiveCondition] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleApplyFilters = () => {
    setActiveLocation(tempLocation);
    setActiveCondition(tempCondition);
    setActiveBrand(tempBrand);
    setActiveCategory(tempCategory);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setTempLocation('All');
    setTempCondition('All');
    setTempBrand('All');
    setTempCategory('All');
    setActiveLocation('All');
    setActiveCondition('All');
    setActiveBrand('All');
    setActiveCategory('All');
    setShowFilters(false);
  };

  useEffect(() => {
    const fetchTrends = async () => {
      if (products.length > 0) {
        setLoadingTrends(true);
        try {
          const result = await predictMarketTrends(products, requests);
          setTrends(result.trends || []);
        } catch (error) {
          console.error("Failed to fetch trends:", error);
        } finally {
          setLoadingTrends(false);
        }
      }
    };
    fetchTrends();
  }, [products.length, requests.length]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesCondition = activeCondition === 'All' || p.condition === activeCondition;
    
    // Check Nigerian state matching
    const matchesLocation = activeLocation === 'All' || (
      p.location && p.location.toLowerCase().includes(activeLocation.toLowerCase())
    );

    // Check brand matching
    const matchesBrand = activeBrand === 'All' || (
      p.brand 
        ? p.brand.toLowerCase() === activeBrand.toLowerCase()
        : p.title.toLowerCase().includes(activeBrand.toLowerCase())
    );

    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = !showVerifiedOnly || p.isVerified;

    return matchesCategory && matchesCondition && matchesLocation && matchesBrand && matchesSearch && matchesVerified && !p.isSold;
  }).sort((a, b) => {
    if (a.isBoosted && !b.isBoosted) return -1;
    if (!a.isBoosted && b.isBoosted) return 1;
    return 0;
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

      {/* AI Market Intelligence Section */}
      <div className="px-2 lg:px-4">
        <div className="bg-[#1A1C20] rounded-[2.5rem] lg:rounded-[4rem] p-8 lg:p-16 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors group-hover:bg-emerald-500/20"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="text-[9px] lg:text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">NairaIntelligence™ Data Engine</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter">Market Pulse.</h2>
              <p className="text-slate-500 text-xs lg:text-base mt-2 font-medium">Real-time proprietary market insights powered by Gemini 3.5 Models.</p>
            </div>
            {loadingTrends && <div className="text-emerald-500 font-bold text-xs animate-pulse uppercase tracking-widest">Scanning Aura Nodes...</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {trends.length > 0 ? (
              trends.map((trend, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:bg-white/10 transition-all group/card">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Trend #{i + 1}</span>
                    <div className="px-3 py-1 bg-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 border border-emerald-500/30">
                      {Math.round(trend.confidence * 100)}% Confidence
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-black text-white mb-4 tracking-tight group-hover/card:text-emerald-400 transition-colors">{trend.title}</h3>
                  <p className="text-xs lg:text-sm text-slate-400 leading-relaxed font-medium">{trend.prediction}</p>
                </div>
              ))
            ) : !loadingTrends && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">No intelligence anomalies detected</p>
              </div>
            )}
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
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">Live Aura.</h2>
          <p className="text-[10px] lg:text-xs font-black text-emerald-500/60 mt-4 lg:mt-6 uppercase tracking-[0.5em]">{filteredProducts.length} Verified Assets Online</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-xl overflow-x-auto no-scrollbar animate-none">
             <button onClick={() => setShowVerifiedOnly(false)} className={`px-5 py-3 rounded-xl text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!showVerifiedOnly ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Latest Drops</button>
             <button onClick={() => setShowVerifiedOnly(true)} className={`px-5 py-3 rounded-xl text-[9px] lg:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${showVerifiedOnly ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Elite Status</button>
          </div>
          
          <button 
            onClick={() => {
              setTempLocation(activeLocation);
              setTempCondition(activeCondition);
              setTempBrand(activeBrand);
              setTempCategory(activeCategory);
              setShowFilters(true);
            }}
            className={`flex items-center gap-2 px-5 py-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-[9px] lg:text-[11px] font-black uppercase tracking-widest hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all ${
              (activeLocation !== 'All' || activeCondition !== 'All' || activeBrand !== 'All' || activeCategory !== 'All')
                ? 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter {(activeLocation !== 'All' || activeCondition !== 'All' || activeBrand !== 'All' || activeCategory !== 'All') && '●'}</span>
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(activeLocation !== 'All' || activeCondition !== 'All' || activeBrand !== 'All' || activeCategory !== 'All') && (
        <div className="flex flex-wrap gap-2 px-2 lg:px-4">
          {activeCategory !== 'All' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-500">
              Category: {activeCategory}
              <button onClick={() => { setActiveCategory('All'); setTempCategory('All'); }} className="hover:text-emerald-700 dark:hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
          {activeLocation !== 'All' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-500">
              State: {activeLocation}
              <button onClick={() => { setActiveLocation('All'); setTempLocation('All'); }} className="hover:text-emerald-700 dark:hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
          {activeCondition !== 'All' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-500">
              Condition: {activeCondition}
              <button onClick={() => { setActiveCondition('All'); setTempCondition('All'); }} className="hover:text-emerald-700 dark:hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
          {activeBrand !== 'All' && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-500">
              Brand: {activeBrand}
              <button onClick={() => { setActiveBrand('All'); setTempBrand('All'); }} className="hover:text-emerald-700 dark:hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          )}
          <button onClick={handleResetFilters} className="text-[9px] font-black uppercase text-slate-500 hover:text-emerald-500 transition-colors py-1.5 px-3">
            Clear All
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 px-2 lg:px-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id}
            onClick={() => onProductClick(product)}
            className="group relative bg-[#0D0D0F] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/5 hover:border-emerald-500/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700 cursor-pointer flex flex-col h-auto min-h-[420px] sm:min-h-[500px] lg:min-h-[600px]"
          >
            <div className="h-[160px] sm:h-[220px] md:h-[280px] lg:h-[320px] relative overflow-hidden bg-[#050505] p-3 sm:p-4 lg:p-6">
              <div className="w-full h-full rounded-[1rem] sm:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-white/5 shadow-inner">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" />
              </div>
              <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 flex flex-col gap-2">
                {product.isBoosted && (
                  <div className="bg-amber-500 text-black px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-1.5">
                    <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                    Boosted
                  </div>
                )}
                <div className="bg-black/70 backdrop-blur-xl px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 w-fit">
                  {product.condition}
                </div>
              </div>
              {product.isVerified && (
                <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:top-8 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_15px_#10b981] group-hover:rotate-[360deg] transition-transform duration-1000">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.061 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" /></svg>
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-2 lg:mb-4">
                <span className="text-[8px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{product.category}</span>
                <span className="text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">{product.location.split(',')[0]}</span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg lg:text-2xl font-black text-white mb-2 lg:mb-4 line-clamp-1 group-hover:text-emerald-500 transition-colors tracking-tight">{product.title}</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 mb-4 lg:mb-6 flex-1 font-medium leading-relaxed opacity-80">{product.description}</p>
              
              <div className="pt-4 lg:pt-6 border-t border-white/10 mb-4 lg:mb-6">
                 <p className="text-[8px] sm:text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1 lg:mb-2">Escrow Value</p>
                 <span className="text-sm sm:text-lg md:text-xl lg:text-3xl font-black text-white tracking-tighter">₦{product.price.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:gap-4">
                 <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="py-2.5 sm:py-3.5 lg:py-4.5 border border-white/10 text-white font-black text-[8px] sm:text-[9px] lg:text-[11px] rounded-lg sm:rounded-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all active:scale-95">Cart</button>
                 <button onClick={(e) => { e.stopPropagation(); onBuyNow(product); }} className="py-2.5 sm:py-3.5 lg:py-4.5 bg-emerald-500 text-black font-black text-[8px] sm:text-[9px] lg:text-[11px] rounded-lg sm:rounded-xl uppercase tracking-wider hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all active:scale-95">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1A1C20] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 dark:text-white animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-150 dark:border-white/5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Aura Hunt Filters</h3>
                <p className="text-[10px] uppercase font-black tracking-wider text-emerald-500 mt-0.5">Narrow down secure listings</p>
              </div>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-500 dark:text-slate-300 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              
              {/* Category Filter */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Item Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['All', 'Electronics', 'Vehicles', 'Fashion', 'Home & Garden', 'Groceries', 'Other'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTempCategory(cat)}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all text-center border ${
                        tempCategory === cat
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-slate-50 dark:bg-[#131518] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter - Nigerian States */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Location (Nigerian States Only)</label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-[#131518] border border-slate-250 dark:border-white/5 text-slate-800 dark:text-white focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                    value={tempLocation}
                    onChange={e => setTempLocation(e.target.value)}
                  >
                    <option value="All">🇳🇬 All Nigerian States</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state} State</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400 dark:text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Asset Condition</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['All', 'New', 'Used', 'Refurbished'].map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setTempCondition(cond)}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all text-center border ${
                        tempCondition === cond
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-slate-50 dark:bg-[#131518] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Brand Filter</label>
                <input
                  type="text"
                  placeholder="Type a custom brand (e.g. Dell, Gucci)..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-[#131518] border border-slate-250 dark:border-white/5 text-slate-800 dark:text-white focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 mb-4"
                  value={tempBrand === 'All' ? '' : tempBrand}
                  onChange={e => setTempBrand(e.target.value.trim() ? e.target.value : 'All')}
                />
                
                {/* Popular Brand Tags */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTempBrand('All')}
                    className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all border ${
                      tempBrand === 'All'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-white/5 border-slate-250 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    All Brands
                  </button>
                  {POPULAR_BRANDS.map(br => (
                    <button
                      key={br}
                      type="button"
                      onClick={() => setTempBrand(br)}
                      className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all border ${
                        tempBrand.toLowerCase() === br.toLowerCase()
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-250 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer - Sticky */}
            <div className="p-8 border-t border-slate-150 dark:border-white/5 bg-slate-50 dark:bg-[#15171B] flex justify-between gap-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-4 bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
