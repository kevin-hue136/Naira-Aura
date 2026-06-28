
import React, { useEffect, useState } from 'react';
import { Category } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userBalance: number;
  unreadCount: number;
  cartCount: number;
  onToggleNotifications: () => void;
  onToggleCart: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Logo = () => (
  <div className="relative group cursor-pointer">
    <div className="absolute -inset-6 bg-emerald-500 rounded-full blur-[40px] opacity-10 group-hover:opacity-40 transition duration-1000"></div>
    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 via-sky-500 to-emerald-600 p-[3px] shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-110 duration-700">
      <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(16,185,129,0.2),transparent)] animate-spin-slow"></div>
        <svg viewBox="0 0 100 100" className="w-9 h-9 text-emerald-500 relative z-10 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]" fill="none">
           <path d="M30 75V25L70 75V25" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
        </svg>
      </div>
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  searchTerm, 
  setSearchTerm,
  userBalance,
  unreadCount,
  cartCount,
  onToggleNotifications,
  onToggleCart,
  theme,
  toggleTheme
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in this browser. Please try another browser like Chrome.");
      return;
    }

    if (isListening) {
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          let cleanedTranscript = transcript.trim();
          if (cleanedTranscript.endsWith('.')) {
            cleanedTranscript = cleanedTranscript.slice(0, -1);
          }
          setSearchTerm(cleanedTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
    }
  };

  const topNavItems = [
    { id: 'market', label: 'Store', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { id: 'sell', label: 'Sell', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg> },
    { id: 'dashboard', label: 'Wallet', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
    { 
      id: 'hunt', 
      label: 'I Want To Buy', 
      isSpecial: true,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> 
    },
  ];

  const bottomNavItems = [
    { id: 'account', label: 'Account', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: 'settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-32 h-screen sticky top-0 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#050505] items-center py-12 gap-12">
        <Logo />
        
        <nav className="flex-1 flex flex-col gap-8 w-full px-4">
          {topNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative p-4 rounded-2xl transition-all duration-300 flex justify-center items-center ${
                activeTab === item.id 
                  ? item.isSpecial 
                    ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                    : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-emerald-500/20' 
                  : item.isSpecial
                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
                    : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title={item.label}
            >
              {item.icon}
              <span className="absolute left-24 px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-2xl">
                {item.label}
              </span>
              {activeTab === item.id && !item.isSpecial && (
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"></div>
              )}
            </button>
          ))}
          
          <div className="h-px w-8 bg-slate-200 dark:bg-white/10 self-center my-4"></div>
 
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative p-4 rounded-2xl transition-all duration-300 flex justify-center items-center ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title={item.label}
            >
              {item.icon}
              <span className="absolute left-24 px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-2xl">
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"></div>
              )}
            </button>
          ))}
        </nav>
 
        <div className="flex flex-col gap-4 items-center mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981] border border-slate-200 dark:border-white/20"></div>
        </div>
      </aside>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/95 dark:bg-[#0D0D0F]/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/5 flex items-center justify-around px-6 z-50 pb-2 shadow-2xl">
        {topNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === item.id 
                ? item.isSpecial 
                  ? 'text-amber-500'
                  : 'text-emerald-500' 
                : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === item.id ? (item.isSpecial ? 'bg-amber-500/10' : 'bg-emerald-500/10') : ''}`}>
              {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
          </button>
        ))}
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === item.id ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-emerald-500/10' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-auto lg:h-28 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 z-40 bg-gradient-to-b from-slate-200/10 dark:from-black/40 to-transparent py-4 lg:py-0 gap-4 lg:gap-0">
          <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start">
            <div className="lg:hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-[#050505] flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-5 h-5 text-emerald-500" fill="none">
                    <path d="M30 75V25L70 75V25" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-8 lg:ml-4">
               <div className="hidden xl:flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">AURA PROTOCOL</span>
                  <span className="text-[12px] font-black text-emerald-500 uppercase tracking-tighter drop-shadow-[0_0_5px_#10b981]">v2.5 GOLD ALPHA</span>
               </div>

                <div className="flex items-center gap-2 lg:gap-4 bg-white/50 dark:bg-white/5 p-1.5 lg:p-2 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl">
                  <button onClick={onToggleCart} className="relative p-2.5 lg:p-4 rounded-[1.2rem] lg:rounded-[1.5rem] bg-slate-100 dark:bg-black/40 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all border border-slate-200/50 dark:border-white/5">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>
                      {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-emerald-500 text-black text-[9px] lg:text-[11px] font-black rounded-full flex items-center justify-center shadow-[0_0_15px_#10b981]">{cartCount}</span>}
                  </button>

                  <button onClick={onToggleNotifications} className="relative p-2.5 lg:p-4 rounded-[1.2rem] lg:rounded-[1.5rem] bg-slate-100 dark:bg-black/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200/50 dark:border-white/5">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      {unreadCount > 0 && <span className="absolute top-2.5 lg:top-4 right-2.5 lg:right-4 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>}
                  </button>

                  <button onClick={toggleTheme} className="relative p-2.5 lg:p-4 rounded-[1.2rem] lg:rounded-[1.5rem] bg-slate-100 dark:bg-black/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200/50 dark:border-white/5">
                      {theme === 'dark' ? (
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.757l-.707-.707M6.343 17.657l-.707-.707M16.95 18.364l.707.707M6.343 6.343l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>
                      ) : (
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      )}
                  </button>
               </div>
               
               <div 
                 onClick={() => setActiveTab('account')}
                 className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full p-[2px] cursor-pointer transition-all hover:rotate-12 ${activeTab === 'account' ? 'bg-emerald-500' : 'bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700'}`}
               >
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#050505] flex items-center justify-center text-[10px] lg:text-xs font-black text-slate-500 dark:text-slate-400 uppercase">JA</div>
               </div>
            </div>
          </div>

          <div className="w-full lg:flex-1 lg:max-w-xl relative group order-last lg:order-none">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <input 
              type="text" 
              placeholder={isListening ? "Listening... Speak now!" : "Hunt assets..."}
              className={`relative w-full pl-12 lg:pl-16 pr-12 lg:pr-16 py-3 lg:py-5 rounded-[2rem] bg-white dark:bg-white/5 border text-xs lg:text-sm font-bold outline-none transition-all shadow-sm dark:shadow-inner ${
                isListening 
                  ? 'border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-300 placeholder-red-400' 
                  : 'border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:border-emerald-500/50 focus:bg-emerald-500/5'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 lg:left-6 top-3 lg:top-5 w-5 h-5 lg:w-6 lg:h-6 text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            
            <button
              onClick={handleVoiceSearch}
              className={`absolute right-4 lg:right-6 top-2.5 lg:top-4 p-1 rounded-full transition-all duration-300 z-10 ${
                isListening 
                  ? 'text-red-500 dark:text-red-400 animate-pulse scale-110 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400'
              }`}
              title={isListening ? "Listening... Speak now!" : "Voice Search (Hands-free)"}
            >
              {isListening ? (
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M5.5 8a.5.5 0 011 0v1a3.5 3.5 0 007 0V8a.5.5 0 011 0v1a4.5 4.5 0 01-4 4.473V17a1 1 0 11-2 0v-3.527A4.5 4.5 0 015.5 9V8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-32 lg:pb-24">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};
