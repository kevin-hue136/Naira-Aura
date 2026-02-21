
import React, { useState, useEffect, useRef } from 'react';
import { scanChatMessage } from '../services/geminiService';
import { Product } from '../types';

interface ChatSystemProps {
  product: Product;
  onClose: () => void;
  onPenalty: (penalty: number) => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ product, onClose, onPenalty }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'merchant', text: string, isFlagged?: boolean }[]>([
    { role: 'merchant', text: `Hello! I see you're interested in the ${product.title}. How can I help you today?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [alert, setAlert] = useState<{ message: string, keywords: string[] } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsScanning(true);

    const scanResult = await scanChatMessage(userMsg);
    setIsScanning(false);

    if (scanResult.isOffPlatformAttempt) {
      setAlert({ message: scanResult.alertMessage, keywords: scanResult.detectedKeywords });
      onPenalty(15); // Immediate 15% drop in Trust Velocity
      setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? { ...m, isFlagged: true } : m));
    } else {
      // Simulate merchant response if not flagged
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'merchant', text: "That sounds good. We can proceed with the Aura Escrow protocol for your safety." }]);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative bg-[#1A1C20] w-full max-w-2xl h-[80vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 lg:p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
              {product.sellerId.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-black text-sm lg:text-base uppercase tracking-tight">Merchant Node: {product.sellerId}</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Secure Aura Link Active</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar bg-black/20">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-6 py-4 rounded-[1.5rem] text-[13px] font-bold leading-relaxed shadow-xl border ${
                m.role === 'user' 
                  ? m.isFlagged ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-emerald-600 border-emerald-500 text-white' 
                  : 'bg-white/5 border-white/10 text-slate-200'
              }`}>
                {m.text}
                {m.isFlagged && (
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Protocol Violation Detected
                  </div>
                )}
              </div>
            </div>
          ))}
          {isScanning && (
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
              <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              Aura Integrity Scan...
            </div>
          )}
        </div>

        {/* Red Alert Overlay */}
        {alert && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
            <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl" />
            <div className="relative bg-[#1A1C20] p-10 rounded-[3rem] border-2 border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.3)] text-center max-w-md">
              <div className="w-20 h-20 bg-red-500 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.5)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">RED ALERT</h3>
              <p className="text-red-400 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Off-Platform Maneuver Detected</p>
              <div className="bg-black/40 p-6 rounded-2xl mb-8 text-left border border-red-500/20">
                <p className="text-slate-300 text-xs font-bold leading-relaxed">
                  {alert.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {alert.keywords.map(k => (
                    <span key={k} className="px-2 py-1 bg-red-500/10 text-red-500 text-[8px] font-black rounded-lg border border-red-500/20 uppercase">{k}</span>
                  ))}
                </div>
              </div>
              <p className="text-slate-500 text-[10px] font-bold mb-8 leading-relaxed">
                Attempting to pay outside the Aura Protocol voids all capital protection. Your Trust Velocity has been permanently penalized.
              </p>
              <button 
                onClick={() => setAlert(null)}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                I Understand the Risk
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 lg:p-8 bg-black/40 border-t border-white/5">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Message merchant..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-emerald-500/50 outline-none transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isScanning}
              className="bg-emerald-500 text-black p-4 rounded-2xl hover:bg-white transition-all active:scale-90 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <p className="mt-4 text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">All messages are scanned by NairaIntelligence™ for your safety.</p>
        </div>
      </div>
    </div>
  );
};
