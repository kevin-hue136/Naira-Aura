
import React from 'react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div className="absolute inset-0 bg-[#0D0E10]/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full lg:max-w-md h-full bg-[#1A1C20] shadow-[0_0_100px_rgba(0,0,0,0.9)] border-l border-white/10 flex flex-col animate-in slide-in-from-right-full duration-500">
        <div className="p-8 lg:p-10 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-white tracking-tighter">Communications</h2>
            <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Activity Stream</p>
          </div>
          <button onClick={onClose} className="p-2.5 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl text-slate-400 transition-all border border-white/10">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 opacity-30">
               <span className="text-4xl mb-4">📭</span>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No signals detected</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-6 rounded-3xl bg-[#0D0E10] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${
                    n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                    n.type === 'payment' ? 'bg-sky-500/10 text-sky-400' :
                    n.type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {n.type === 'payment' ? '₦' : n.type === 'success' ? '✓' : n.type === 'alert' ? '!' : '💡'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{n.type} notification</span>
                       <span className="text-[9px] font-bold text-slate-600">{n.time}</span>
                    </div>
                    <p className="text-sm font-bold text-white leading-relaxed">{n.text}</p>
                  </div>
                </div>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  n.type === 'success' ? 'bg-emerald-500' :
                  n.type === 'payment' ? 'bg-sky-500' :
                  n.type === 'alert' ? 'bg-red-500' : 'bg-amber-500'
                } opacity-20`}></div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 border-t border-white/10 bg-[#0D0E10]">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center leading-relaxed">
             Secure Trading is our priority. Never share your NairaMart verification codes with anyone.
           </p>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};
