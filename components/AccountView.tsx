
import React, { useState } from 'react';
import { User } from '../types';

interface AccountViewProps {
  user: User;
  onUpdateProfile: (data: Partial<User>) => void;
  onUpgradeVerification: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ user, onUpdateProfile, onUpgradeVerification }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [whaleStatus, setWhaleStatus] = useState<'none' | 'pending' | 'active'>('none');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber
  });

  const securityLogs = [
    { id: '1', action: 'Vault Authentication', time: '14:20 Today', location: 'Lagos, NG', status: 'Success' },
    { id: '2', action: 'Protocol Release', time: 'Yesterday', location: 'Lagos, NG', status: 'Success' },
    { id: '3', action: 'New Node Linked', time: '3 Days Ago', location: 'Ikeja, NG', status: 'Verified' }
  ];

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleDownloadHistory = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("Aura Transaction Ledger (PDF) has been generated and pushed to your device storage.");
    }, 2000);
  };

  const handleWhaleRequest = () => {
    setWhaleStatus('pending');
    onUpgradeVerification();
  };

  return (
    <div className="space-y-8 lg:space-y-16 animate-in fade-in duration-700 pb-20 px-2 lg:px-0">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Profile Card */}
        <div className="lg:w-1/3 w-full bg-[#1A1C20] rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 p-[3px] mb-6 lg:mb-8 shadow-2xl">
              <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-2xl lg:text-4xl font-black text-slate-400">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {isEditing ? (
              <div className="w-full space-y-4 animate-in slide-in-from-top-2">
                <input 
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-emerald-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Full Name"
                />
                <input 
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-emerald-500"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                />
                <input 
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-bold outline-none focus:border-emerald-500"
                  value={formData.phoneNumber}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="Phone"
                />
                <div className="flex gap-2 pt-4">
                  <button onClick={handleSave} className="flex-1 py-4 bg-emerald-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Save</button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-xl text-[10px] uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">{user.name}</h2>
                <p className="text-sm font-bold text-slate-500 mb-8">{user.email}</p>
                
                <div className="w-full bg-black/40 p-6 rounded-3xl border border-white/5 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aura ID</span>
                    <span className="text-xs font-mono text-white">#00{user.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Phone Node</span>
                    <span className="text-xs font-mono text-white">{user.phoneNumber}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
                >
                   Edit Identity
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status & Verification */}
        <div className="flex-1 w-full space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1A1C20] p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 shadow-xl group">
               <div className="flex justify-between items-start mb-6 lg:mb-8">
                  <div className="p-3 lg:p-4 bg-emerald-500/10 rounded-xl lg:rounded-2xl border border-emerald-500/20 text-emerald-500">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="text-[8px] lg:text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 lg:px-4 py-1 lg:py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">Tier 3 Active</span>
               </div>
               <h3 className="text-xl lg:text-2xl font-black text-white mb-3 lg:mb-4 tracking-tighter">Institutional Verified</h3>
               <p className="text-[10px] lg:text-xs font-medium text-slate-500 leading-relaxed mb-6 lg:mb-8">Your identity has been cross-referenced with local banking nodes.</p>
               
               {whaleStatus === 'none' ? (
                 <button onClick={handleWhaleRequest} className="w-full py-3.5 lg:py-4 bg-emerald-600 text-white font-black rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/40 active:scale-95">
                   Request Whale Status
                 </button>
               ) : (
                 <div className="w-full py-3.5 lg:py-4 bg-white/5 text-emerald-500 border border-emerald-500/20 text-center rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest animate-pulse">
                   Whale Application Pending
                 </div>
               )}
            </div>

            <div className="bg-[#1A1C20] p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 shadow-xl">
               <div className="flex justify-between items-start mb-6 lg:mb-8">
                  <div className="p-3 lg:p-4 bg-sky-500/10 rounded-xl lg:rounded-2xl border border-sky-500/20 text-sky-500">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Aura Score</p>
                    <p className="text-2xl lg:text-3xl font-black text-white tracking-tighter">{user.trustVelocity}%</p>
                  </div>
               </div>
               <h3 className="text-xl lg:text-2xl font-black text-white mb-3 lg:mb-4 tracking-tighter">Market Reputation</h3>
               <div className="w-full bg-black h-2.5 lg:h-3 rounded-full mb-6 lg:mb-8 shadow-inner overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-sky-400 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${user.trustVelocity}%` }}></div>
               </div>
               <p className="text-[9px] lg:text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Protocol health is optimal.</p>
            </div>
          </div>

          <div className="bg-[#1A1C20] rounded-[2.5rem] lg:rounded-[3rem] border border-white/10 shadow-xl overflow-hidden">
             <div className="p-8 lg:p-10 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h4 className="text-lg lg:text-xl font-black text-white tracking-tighter">Security Logs</h4>
                <button 
                  onClick={handleDownloadHistory}
                  disabled={isDownloading}
                  className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                >
                  {isDownloading ? (
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : 'Download History'}
                </button>
             </div>
             <div className="p-4">
                {securityLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-6 hover:bg-white/5 rounded-3xl transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <div>
                          <p className="text-sm font-black text-white tracking-tight">{log.action}</p>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{log.time} • {log.location}</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 rounded-xl border border-emerald-500/10">{log.status}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
