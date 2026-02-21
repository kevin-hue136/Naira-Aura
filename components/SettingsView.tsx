
import React, { useState } from 'react';
import { User, AiSettings } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdateProfile: (data: Partial<User>) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onUpdateAiSettings: (settings: AiSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  user, 
  onUpdateProfile, 
  theme, 
  setTheme,
  onUpdateAiSettings
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'ai'>('profile');
  const [localUser, setLocalUser] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(localUser);
  };

  const Toggle = ({ enabled, setEnabled, label, subLabel }: any) => (
    <div className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-black/10 transition-all hover:border-emerald-500/20">
      <div className="flex-1 mr-4">
        <p className="text-xs font-black mb-1 uppercase tracking-tight text-white">{label}</p>
        <p className="text-[9px] font-bold uppercase tracking-tight text-slate-500">{subLabel}</p>
      </div>
      <button 
        onClick={() => setEnabled(!enabled)}
        className={`w-10 h-6 rounded-full transition-all relative ${enabled ? 'bg-emerald-600' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  );

  const voicePersonas = [
    { id: 'Zephyr', label: 'Zephyr', bio: 'Warm & Friendly' },
    { id: 'Kore', label: 'Kore', bio: 'Formal & Precise' },
    { id: 'Puck', label: 'Puck', bio: 'Savvy & Helpful' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-200 px-2 lg:px-0">
      <div className="flex gap-3 lg:gap-4 p-1 bg-black/20 rounded-xl lg:rounded-2xl border border-white/5 w-fit">
        {['profile', 'ai'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-[#1A1C20] p-6 lg:p-8 rounded-[2rem] lg:rounded-3xl border border-white/5 shadow-2xl space-y-6 lg:space-y-8">
           <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center text-lg lg:text-xl font-black">
                 {user.name.charAt(0)}
              </div>
              <h3 className="text-base lg:text-lg font-black text-white">Merchant Profile</h3>
           </div>
           <form onSubmit={handleSaveProfile} className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <input className="w-full p-4 rounded-xl bg-black/20 border border-white/5 text-white text-xs font-bold" placeholder="Full Name" value={localUser.name} onChange={e=>setLocalUser({...localUser, name: e.target.value})} />
                <input className="w-full p-4 rounded-xl bg-black/20 border border-white/5 text-white text-xs font-bold" placeholder="Email" value={localUser.email} onChange={e=>setLocalUser({...localUser, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-emerald-600 py-3.5 lg:py-4 rounded-xl text-[9px] lg:text-[10px] font-black uppercase text-white">Save Identity</button>
           </form>
           <div className="pt-4 lg:pt-6 border-t border-white/5">
              <Toggle enabled={theme === 'dark'} setEnabled={() => setTheme(theme === 'dark' ? 'light' : 'dark')} label="Dark Interface" subLabel="Optimized for late-night trading" />
           </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-[#1A1C20] p-6 lg:p-8 rounded-[2rem] lg:rounded-3xl border border-white/5 shadow-2xl space-y-8 lg:space-y-10">
           <Toggle 
              enabled={user.aiSettings.voiceEnabled} 
              setEnabled={(v: boolean) => onUpdateAiSettings({...user.aiSettings, voiceEnabled: v})}
              label="Audible Assistant"
              subLabel="AI will speak market guidance"
           />
           <div className="grid grid-cols-1 gap-4">
              {voicePersonas.map(v => (
                <button
                  key={v.id}
                  onClick={() => onUpdateAiSettings({...user.aiSettings, voiceName: v.id as any})}
                  className={`p-5 rounded-2xl text-left border transition-all flex items-center gap-4 ${user.aiSettings.voiceName === v.id ? 'bg-emerald-600/10 border-emerald-500/40' : 'bg-black/20 border-white/5'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.aiSettings.voiceName === v.id ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                    ✨
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-tight ${user.aiSettings.voiceName === v.id ? 'text-emerald-500' : 'text-white'}`}>{v.label}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{v.bio}</p>
                  </div>
                </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
