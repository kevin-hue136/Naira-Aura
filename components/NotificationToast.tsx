
import React from 'react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg border border-emerald-400/30">✓</div>;
      case 'payment': return <div className="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-lg border border-sky-400/30">₦</div>;
      case 'alert': return <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg border border-red-400/30">!</div>;
      default: return <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg border border-amber-400/30">💡</div>;
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[120] w-full max-w-sm animate-in slide-in-from-right-full duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
      <div className="bg-[#1A1C20] border border-white/20 p-6 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] flex items-start gap-5 group relative overflow-hidden">
        {/* Visual separation layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 shrink-0">
          {getIcon()}
        </div>
        
        <div className="relative z-10 flex-1">
          <div className="flex justify-between items-start mb-1">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{notification.type} alert</span>
             <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <p className="text-sm font-black text-white leading-relaxed">{notification.text}</p>
          <div className="flex items-center gap-2 mt-3">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{notification.time}</p>
          </div>
        </div>

        {/* Highlight strip for separation */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity ${
          notification.type === 'alert' ? 'bg-red-500' : 
          notification.type === 'payment' ? 'bg-sky-500' : 'bg-amber-500'
        } opacity-40 group-hover:opacity-100`}></div>
      </div>
    </div>
  );
};
