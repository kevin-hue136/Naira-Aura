
import React, { useState } from 'react';
import { Product, Review } from '../types';
import { analyzePrice, translateToPidgin } from '../services/geminiService';

interface ProductViewProps {
  product: Product;
  onClose: () => void;
  onPurchase: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onContactMerchant: () => void;
}

export const ProductView: React.FC<ProductViewProps> = ({ product, onClose, onPurchase, onAddToCart, onContactMerchant }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [priceAnalysis, setPriceAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pidginText, setPidginText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showManeuverWarning, setShowManeuverWarning] = useState(false);

  const handlePriceAnalysis = async () => {
    setIsAnalyzing(true);
    const analysis = await analyzePrice(product.title, product.price, product.category);
    setPriceAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    const trans = await translateToPidgin(product.description);
    setPidginText(trans);
    setIsTranslating(false);
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-emerald-500 fill-emerald-500' : 'text-slate-700'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 lg:p-8">
      <div className="absolute inset-0 bg-[#0D0E10]/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#1A1C20] w-full max-w-7xl h-full lg:h-[90vh] rounded-none lg:rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row border border-white/5 animate-in zoom-in-95 duration-500">
        
        <button onClick={onClose} className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 p-2.5 lg:p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl transition-all active:scale-90 border border-white/5 text-white">
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Image Gallery */}
        <div className="h-[40vh] lg:h-full lg:w-7/12 bg-[#0D0E10] flex flex-col p-6 lg:p-10 overflow-hidden shrink-0">
          <div className="flex-1 relative rounded-2xl lg:rounded-3xl overflow-hidden bg-[#1A1C20] shadow-2xl border border-white/5 group">
            <img src={product.images[activeImage]} className="w-full h-full object-contain p-2 lg:p-4 group-hover:scale-105 transition-transform duration-700" alt={product.title} />
          </div>
          <div className="flex gap-3 lg:gap-4 mt-4 lg:mt-8 justify-center overflow-x-auto py-2 no-scrollbar">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${idx === activeImage ? 'border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : 'border-transparent opacity-30 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details & Reviews */}
        <div className="flex-1 lg:w-5/12 p-6 lg:p-14 flex flex-col overflow-y-auto bg-[#1A1C20] border-l border-white/5 custom-scrollbar">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <span className="px-3 py-1 lg:px-4 lg:py-1.5 bg-emerald-500/10 text-emerald-400 text-[8px] lg:text-[10px] font-black rounded-lg lg:rounded-xl uppercase tracking-widest border border-emerald-500/20">{product.category}</span>
              {product.isVerified && <span className="px-3 py-1 lg:px-4 lg:py-1.5 bg-sky-500 text-white text-[8px] lg:text-[10px] font-black rounded-lg lg:rounded-xl uppercase tracking-widest shadow-xl">Verified</span>}
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg lg:rounded-xl border border-white/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[8px] lg:text-[9px] font-black text-slate-300 uppercase">TV: {product.trustVelocity || 98}%</span>
              </div>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black text-white leading-[1.1] mb-4 lg:mb-6 tracking-tighter">{product.title}</h1>
            
            <div className="flex items-center gap-4 lg:gap-6">
               <div className="flex items-center gap-2 lg:gap-3 bg-white/5 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-white/5">
                  <StarRating rating={product.sellerRating} />
                  <span className="font-black text-xs lg:text-sm text-white">{product.sellerRating} <span className="text-slate-500 font-bold ml-1">({product.sellerReviewCount})</span></span>
               </div>
               <div className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest">{product.location}</div>
            </div>
          </div>

          {/* Integrity Warning Section */}
          <div className="mb-8 lg:mb-10 bg-red-500/5 border border-red-500/20 p-4 lg:p-6 rounded-2xl lg:rounded-3xl">
             <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3 text-red-500">
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <h4 className="text-[9px] lg:text-[11px] font-black uppercase tracking-widest">Escrow Security Alert</h4>
             </div>
             <p className="text-[9px] lg:text-[10px] font-medium text-slate-400 leading-relaxed italic">
               Never pay a merchant directly via Cash, Transfer, or outside the app.
               <button onClick={() => setShowManeuverWarning(!showManeuverWarning)} className="ml-2 text-emerald-500 underline font-black uppercase tracking-widest">Why?</button>
             </p>
             {showManeuverWarning && (
               <div className="mt-3 p-3 lg:p-4 bg-black/30 rounded-xl lg:rounded-2xl border border-white/5 text-[8px] lg:text-[9px] font-bold text-slate-500 leading-normal animate-in slide-in-from-top-2">
                 If you pay outside, we cannot track your capital. Merchants asking for "Physical Cash" or "Direct Transfer" are often high-risk nodes.
               </div>
             )}
          </div>

          <div className="bg-[#0D0E10] text-white rounded-[2rem] lg:rounded-3xl p-6 lg:p-10 mb-8 lg:mb-10 border border-white/5 shadow-2xl">
            <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] mb-2 lg:mb-3 text-emerald-500">Fixed 0.5% Secure Escrow</div>
            <div className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6 tracking-tighter">₦{product.price.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-4 lg:gap-6 pt-6 lg:pt-8 border-t border-white/5">
               <div className="flex flex-col gap-0.5">
                  <div className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Escrow Fee</div>
                  <div className="font-black text-xs lg:text-base text-emerald-400">₦{(product.price * 0.005).toLocaleString()}</div>
               </div>
               <div className="flex flex-col gap-0.5">
                  <div className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Protection</div>
                  <div className="font-black text-xs lg:text-base text-emerald-500 uppercase tracking-tighter">Guaranteed</div>
               </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-4 lg:space-y-6 mb-8 lg:mb-12">
             <div className="flex gap-3 lg:gap-4">
                <button 
                  onClick={handlePriceAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1 bg-sky-500/10 text-sky-400 px-4 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest hover:bg-sky-500/20 transition-all border border-sky-500/10 flex items-center justify-center gap-2 active:scale-95"
                >
                  {isAnalyzing ? <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin"></div> : "AI Intel"}
                </button>
                <button 
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="flex-1 bg-amber-500/10 text-amber-500 px-4 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all border border-amber-500/10 flex items-center justify-center gap-2 active:scale-95"
                >
                  {isTranslating ? <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div> : "Pidgin"}
                </button>
             </div>
             {priceAnalysis && (
               <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 p-6 lg:p-8 rounded-2xl lg:rounded-3xl animate-in fade-in slide-in-from-left-4">
                  <p className="text-xs lg:text-sm font-bold leading-relaxed whitespace-pre-line">{priceAnalysis}</p>
               </div>
             )}
          </div>

          {/* Description */}
          <div className="mb-8 lg:mb-12">
            <h3 className="font-black text-[9px] lg:text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-4 lg:mb-6">Merchant Description</h3>
            <div className="bg-[#0D0E10] p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-white/5">
              <p className="text-white text-sm lg:text-base leading-relaxed font-medium whitespace-pre-line">
                {pidginText || product.description}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h3 className="font-black text-[9px] lg:text-[11px] uppercase tracking-[0.2em] text-slate-500">Verified Reviews</h3>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No reviews yet</p>
                </div>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#0D0E10] p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-white/5">
                    <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white/5 flex items-center justify-center text-[8px] lg:text-[10px] font-black text-slate-400 uppercase">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs lg:text-sm font-black text-white">{rev.userName}</p>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-slate-400 text-xs lg:text-sm font-medium leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4 mt-auto pb-10 lg:pb-0">
            <button 
              onClick={() => onPurchase(product)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 lg:py-6 rounded-xl lg:rounded-2xl shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 lg:gap-3 text-base lg:text-xl active:scale-95"
            >
              Secure with Escrow
            </button>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black py-3.5 lg:py-5 rounded-xl lg:rounded-2xl transition-all text-[9px] lg:text-[11px] uppercase tracking-widest active:scale-95 flex items-center justify-center gap-1.5 lg:gap-2"
              >
                 <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                 Cart
              </button>
              <button 
                onClick={onContactMerchant}
                className="w-full bg-[#25282e] hover:bg-[#2c3036] text-white border border-white/10 font-black py-3.5 lg:py-5 rounded-xl lg:rounded-2xl transition-all text-[9px] lg:text-[11px] uppercase tracking-widest active:scale-95"
              >
                 Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
