
import React, { useState } from 'react';
import { generateContract, getPricingGuidance, generateDebtReminder } from '../services/geminiService';
import { DebtRecord, InventoryItem, SmartContract } from '../types';

interface BusinessSuiteProps {
  onNotify: (msg: string, type?: 'success' | 'payment' | 'alert' | 'info') => void;
}

export const BusinessSuite: React.FC<BusinessSuiteProps> = ({ onNotify }) => {
  const [activeTool, setActiveTool] = useState<'fx' | 'contracts' | 'intelligence' | 'pricing' | 'debt' | 'inventory'>('inventory');
  const [loading, setLoading] = useState(false);
  
  const [fxInput, setFxInput] = useState({ rate: 1580, cost: 0, customs: 10, shipping: 5 });
  const [pricingInput, setPricingInput] = useState({ cost: 1000, overhead: 200, margin: 25 });
  const [pricingAdvice, setPricingAdvice] = useState('');

  // Inventory Logic
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Macbook Pro M2', category: 'Electronics', stockLevel: 5, buyPrice: 1200000, currentMarketValue: 1350000, lastRestockDate: '2023-11-20', inflationImpact: 12.5 },
    { id: '2', name: 'Thai Rice 50kg', category: 'Groceries', stockLevel: 24, buyPrice: 72000, currentMarketValue: 88000, lastRestockDate: '2023-12-05', inflationImpact: 22.2 }
  ]);

  // Contract Logic
  const [contracts, setContracts] = useState<SmartContract[]>([
    { id: 'c1', type: 'Trade', parties: 'Alhaji Musa & John Adebayo', details: 'Supply of 500 bags of cement', content: 'Standard trade agreement for bulk cement supply in the Lagos region.', status: 'Signed', createdAt: '2023-12-10' }
  ]);
  const [contractForm, setContractForm] = useState({ parties: '', details: '', type: 'Trade' as any });

  const [debts, setDebts] = useState<DebtRecord[]>([
    { id: '1', customerName: 'Emeka Global Shop', amount: 45000, dueDate: '2023-10-20', status: 'Pending', notes: 'Unpaid fashion stock' }
  ]);

  const handleCreateContract = async () => {
    if (!contractForm.parties || !contractForm.details) {
      alert("Please fill in parties and details.");
      return;
    }
    setLoading(true);
    const content = await generateContract(contractForm.type, contractForm.parties, contractForm.details);
    const newContract: SmartContract = {
      id: Math.random().toString(36).substr(2, 9),
      type: contractForm.type,
      parties: contractForm.parties,
      details: contractForm.details,
      content: content,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContracts([newContract, ...contracts]);
    setLoading(false);
    setContractForm({ parties: '', details: '', type: 'Trade' });
    onNotify("Smart Agreement drafted successfully.", 'success');
  };

  const calculatePricing = async () => {
    setLoading(true);
    const advice = await getPricingGuidance(pricingInput.cost, pricingInput.overhead, pricingInput.margin);
    setPricingAdvice(advice);
    setLoading(false);
    onNotify("AI Pricing guidance generated.");
  };

  // Fix: Implemented handleEscalateDebt using the AI generateDebtReminder service
  const handleEscalateDebt = async (name: string, amount: number) => {
    setLoading(true);
    const reminder = await generateDebtReminder(name, amount);
    onNotify(`AI Escalation initiated for ${name}. Reminder: ${reminder}`, 'alert');
    setLoading(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-white">Merchant Core</h2>
          <p className="text-base font-bold text-emerald-500 mt-2 uppercase tracking-[0.2em]">Institutional-grade asset management</p>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-[#1A1C20] p-2 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto scrollbar-hide max-w-full">
          {['inventory', 'contracts', 'debt', 'pricing', 'fx'].map((tool) => (
            <button 
              key={tool}
              onClick={() => setActiveTool(tool as any)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTool === tool ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {tool === 'fx' ? 'Landed Cost' : tool}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          
          {activeTool === 'inventory' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-white">Stock Portfolio</h3>
                <button 
                  onClick={() => onNotify("Add Inventory Portal temporarily locked for tier verification.", 'alert')}
                  className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                >
                  Add Inventory Item
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {inventory.map(item => (
                  <div key={item.id} className="bg-[#1A1C20] p-10 rounded-3xl border border-white/5 shadow-2xl group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-2">{item.category}</span>
                        <h4 className="text-2xl font-black text-white group-hover:text-emerald-500 transition-colors">{item.name}</h4>
                      </div>
                      <div className="bg-white/5 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-400">Qty: {item.stockLevel}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-10 pt-8 border-t border-white/5">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Buy Price</p>
                        <p className="text-lg font-black text-white">₦{item.buyPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Market Value</p>
                        <p className="text-lg font-black text-emerald-500">₦{item.currentMarketValue.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs">📈</div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Yield on Asset</span>
                      </div>
                      <span className="text-sm font-black text-emerald-500">+₦{(item.currentMarketValue - item.buyPrice).toLocaleString()}</span>
                    </div>

                    <div className="mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">
                      Macro Alert: Asset inflation impact is {item.inflationImpact}% this quarter.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'contracts' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4">
               <div className="bg-[#1A1C20] p-12 rounded-3xl border border-white/5 shadow-2xl">
                 <h3 className="text-2xl font-black text-white mb-10">AI Smart Contracts</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Counterparties</label>
                      <input 
                        placeholder="Legal names of parties..." 
                        className="w-full bg-[#0D0E10] border border-white/5 p-5 rounded-xl px-8 text-white font-bold outline-none focus:border-emerald-500/50"
                        value={contractForm.parties}
                        onChange={e => setContractForm({...contractForm, parties: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Agreement Type</label>
                      <select 
                        className="w-full bg-[#0D0E10] border border-white/5 p-5 rounded-xl px-8 text-white font-bold outline-none appearance-none cursor-pointer"
                        value={contractForm.type}
                        onChange={e => setContractForm({...contractForm, type: e.target.value as any})}
                      >
                        <option>Trade</option>
                        <option>Supply</option>
                        <option>Service</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Terms & Deliverables</label>
                      <textarea 
                        rows={4} 
                        placeholder="Detail the scope of work or item specifications..." 
                        className="w-full bg-[#0D0E10] border border-white/5 p-8 rounded-3xl text-white font-medium outline-none focus:border-emerald-500/50 resize-none"
                        value={contractForm.details}
                        onChange={e => setContractForm({...contractForm, details: e.target.value})}
                      />
                    </div>
                 </div>
                 <button 
                  onClick={handleCreateContract}
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white font-black py-6 rounded-2xl shadow-2xl shadow-emerald-900/40 text-lg flex items-center justify-center gap-4 transition-all active:scale-95"
                 >
                   {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Draft Smart Agreement'}
                 </button>
               </div>

               <div className="space-y-6">
                 <h3 className="text-xl font-black text-white ml-2">Secure Agreement Vault</h3>
                 {contracts.map(c => (
                   <div key={c.id} className="bg-[#1A1C20] p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">📜</div>
                        <div>
                          <p className="text-lg font-black text-white">{c.parties}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category: {c.type} • Reference ID: {c.id}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${c.status === 'Signed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                          {c.status}
                        </span>
                        <button 
                          onClick={() => onNotify("Opening Agreement Document viewer...")}
                          className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                           <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTool === 'pricing' && (
            <div className="bg-[#1A1C20] rounded-3xl p-12 border border-white/5 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 text-3xl shadow-inner text-xs">🏷️</div>
                <div><h3 className="text-2xl font-black tracking-tight">AI Price Analytics</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Optimized margin calculation</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div><label className="text-[11px] font-black uppercase text-slate-500 mb-3 block tracking-widest">Cost Price</label>
                <input type="number" value={pricingInput.cost} onChange={e => setPricingInput({...pricingInput, cost: Number(e.target.value)})} className="w-full p-5 rounded-xl px-8 bg-[#0D0E10] border border-white/5 text-white font-black" /></div>
                <div><label className="text-[11px] font-black uppercase text-slate-500 mb-3 block tracking-widest">Overheads</label>
                <input type="number" value={pricingInput.overhead} onChange={e => setPricingInput({...pricingInput, overhead: Number(e.target.value)})} className="w-full p-5 rounded-xl px-8 bg-[#0D0E10] border border-white/5 text-white font-black" /></div>
                <div><label className="text-[11px] font-black uppercase text-slate-500 mb-3 block tracking-widest">Margin %</label>
                <input type="number" value={pricingInput.margin} onChange={e => setPricingInput({...pricingInput, margin: Number(e.target.value)})} className="w-full p-5 rounded-xl px-8 bg-[#0D0E10] border border-white/5 text-white font-black" /></div>
              </div>
              <button onClick={calculatePricing} disabled={loading} className="w-full py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-2xl shadow-emerald-900/40 text-xl active:scale-95 transition-all">{loading ? 'Processing...' : 'Calculate Optimal Price'}</button>
              {pricingAdvice && <div className="mt-10 p-10 bg-sky-500/10 rounded-3xl border border-sky-500/20 text-white font-medium italic leading-relaxed shadow-inner">"{pricingAdvice}"</div>}
            </div>
          )}

          {activeTool === 'debt' && (
            <div className="bg-[#1A1C20] rounded-3xl p-12 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-3xl shadow-inner text-xs">⏳</div>
                <div><h3 className="text-2xl font-black tracking-tight">Receivables Manager</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monitor credit line exposure</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <input placeholder="Debtor Name" className="md:col-span-2 p-5 rounded-xl px-8 bg-[#0D0E10] border border-white/5 text-white font-bold" />
                <input type="number" placeholder="₦ Amount" className="p-5 rounded-xl px-8 bg-[#0D0E10] border border-white/5 text-white font-black" />
                <button onClick={() => onNotify("Receivable logged in ledger.")} className="bg-emerald-600 text-white font-black rounded-2xl p-5 hover:bg-emerald-700 transition-all active:scale-95">Log</button>
              </div>
              <div className="space-y-4">
                {debts.map(d => (
                  <div key={d.id} className="flex justify-between items-center p-8 rounded-3xl bg-[#0D0E10] border border-white/5 group">
                    <div><p className="font-black text-white text-lg tracking-tight mb-1">{d.customerName}</p><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Deadline: {d.dueDate}</p></div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-500 tracking-tighter">₦{d.amount.toLocaleString()}</p>
                      <button 
                        onClick={() => handleEscalateDebt(d.customerName, d.amount)}
                        className="text-[11px] font-black text-amber-500 uppercase tracking-widest mt-2 hover:text-amber-400 active:scale-95 transition-all"
                      >
                        Escalate via AI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'fx' && (
            <div className="bg-[#1A1C20] rounded-3xl p-12 border border-white/5 shadow-2xl animate-in slide-in-from-left-4">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-3xl font-black shadow-inner border border-emerald-500/10 text-xs">₦</div>
                <div><h3 className="text-2xl font-black tracking-tight">FX Landed Calculator</h3><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Parallel market import pricing</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-3">USD Parallel Exchange (₦)</label>
                    <input type="number" value={fxInput.rate} onChange={e => setFxInput({...fxInput, rate: Number(e.target.value)})} className="w-full px-8 py-4 rounded-xl bg-[#0D0E10] border border-white/5 text-white font-black outline-none focus:border-emerald-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-3">FOB Cost (USD)</label>
                    <input type="number" value={fxInput.cost} onChange={e => setFxInput({...fxInput, cost: Number(e.target.value)})} className="w-full px-8 py-4 rounded-xl bg-[#0D0E10] border border-white/5 text-white font-black outline-none focus:border-emerald-500/50 transition-all" />
                  </div>
                </div>
                <div className="bg-[#0D0E10] rounded-3xl p-10 border border-emerald-500/20 flex flex-col justify-center text-center shadow-inner">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Final Landed Cost</span>
                  <span className="text-5xl font-black text-emerald-500 tracking-tighter">₦{((fxInput.cost * fxInput.rate) * (1 + (fxInput.customs + fxInput.shipping) / 100)).toLocaleString()}</span>
                  <div className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                    Real-time Macro Simulation
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[#1A1C20] rounded-3xl p-10 border border-white/5 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Portfolio Alpha</h4>
            <div className="space-y-6">
               <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Total Assets Locked</p>
                  <p className="text-2xl font-black text-white">₦{inventory.reduce((a,b)=>a+b.currentMarketValue,0).toLocaleString()}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">MoM Revenue Growth</p>
                  <p className="text-2xl font-black text-emerald-500">+22.4%</p>
               </div>
            </div>
            <div className="mt-10 pt-10 border-t border-white/5">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Risk Level</span>
                  <span className="text-xs font-black text-emerald-500">Minimal</span>
               </div>
               <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[94%]"></div>
               </div>
            </div>
          </div>

          <div className="bg-[#1A1C20] rounded-3xl p-10 border border-white/5 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">NairaIntelligence™</h4>
            <div className="space-y-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">"Liquidity in the used vehicle sector is peaking. Optimal exit time for listed units."</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">"Supply chain volatility detected. Reviewing contracts for delivery variance clauses."</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
