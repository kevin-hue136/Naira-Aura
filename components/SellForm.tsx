
import React, { useState, useRef } from 'react';
import { Category } from '../types';
import { validateProduct, generateDescription } from '../services/geminiService';

interface SellFormProps {
  onSubmit: (data: any) => void;
}

export const SellForm: React.FC<SellFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Electronics' as Category,
    location: '',
    condition: 'New'
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const MIN_IMAGES = 3;

  const handleAIHelp = async () => {
    if (!formData.title) {
      setErrors(prev => ({ ...prev, title: 'Enter a title first for AI writing assistance.' }));
      return;
    }
    setLoading(true);
    const desc = await generateDescription(formData.title, formData.category);
    setFormData(prev => ({ ...prev, description: desc || '' }));
    setLoading(false);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc = `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)} (Detected)`;
        setFormData(prev => ({ ...prev, location: loc }));
        setLoading(false);
      },
      (error) => {
        alert('Could not fetch location automatically. Please type it in.');
        setLoading(false);
      }
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const newImagePromises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    const base64Images = await Promise.all(newImagePromises);
    setImages(prev => [...prev, ...base64Images.filter(img => !prev.includes(img))]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Item heading is required';
    if (!formData.description.trim()) newErrors.description = 'Item description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than zero';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (images.length < MIN_IMAGES) newErrors.images = `At least ${MIN_IMAGES} verification photos are required`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const validation = await validateProduct(formData.title, formData.description);
    if (!validation.isAllowed) {
      alert(`Listing rejected by safety system: ${validation.reason}`);
      setLoading(false);
      return;
    }
    onSubmit({ 
      ...formData, 
      images, 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(), 
      isSold: false,
      sellerRating: 5.0,
      sellerReviewCount: 0,
      isVerified: true
    });
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#25282e] p-6 lg:p-14 rounded-[2rem] lg:rounded-3xl shadow-2xl border border-white/5 animate-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8 lg:mb-12 text-center">
        <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2 lg:mb-4 block">Free Merchant Portal</span>
        <h2 className="text-2xl lg:text-4xl font-black text-white mb-2 lg:mb-4 tracking-tighter">Zero Cost Listing</h2>
        <p className="text-slate-500 text-xs lg:text-sm font-medium">Verification and AI tools are 100% free.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-2">Item Heading</label>
              <input 
                className={`w-full px-5 py-4 rounded-2xl bg-[#1a1c20] border ${errors.title ? 'border-red-500' : 'border-white/5'} text-white focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600`}
                placeholder="e.g. iPhone 15 Pro Max"
                value={formData.title}
                onChange={e => {
                    setFormData({ ...formData, title: e.target.value });
                    if(errors.title) setErrors(prev => {const n={...prev}; delete n.title; return n;});
                }}
              />
              {errors.title && <p className="mt-2 text-red-500 text-[10px] font-bold uppercase">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-2">Category</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl bg-[#1a1c20] border border-white/5 text-white focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  <option>Electronics</option>
                  <option>Vehicles</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                  <option>Groceries</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-2">Condition</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl bg-[#1a1c20] border border-white/5 text-white focus:border-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option>New</option>
                  <option>Used</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest mb-2">Market Price (₦)</label>
              <input 
                type="number"
                className={`w-full px-5 py-4 rounded-2xl bg-[#1a1c20] border ${errors.price ? 'border-red-500' : 'border-white/5'} text-white focus:border-emerald-500 outline-none transition-all font-black`}
                value={formData.price || ''}
                onChange={e => {
                    setFormData({ ...formData, price: parseInt(e.target.value) || 0 });
                    if(errors.price) setErrors(prev => {const n={...prev}; delete n.price; return n;});
                }}
              />
              {errors.price && <p className="mt-2 text-red-500 text-[10px] font-bold uppercase">{errors.price}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest">Trade Location</label>
                <button 
                  type="button"
                  onClick={detectLocation}
                  className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  Detect (Free)
                </button>
              </div>
              <input 
                className={`w-full px-5 py-4 rounded-2xl bg-[#1a1c20] border ${errors.location ? 'border-red-500' : 'border-white/5'} text-white focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-600`}
                placeholder="Lekki Phase 1, Lagos"
                value={formData.location}
                onChange={e => {
                    setFormData({ ...formData, location: e.target.value });
                    if(errors.location) setErrors(prev => {const n={...prev}; delete n.location; return n;});
                }}
              />
              {errors.location && <p className="mt-2 text-red-500 text-[10px] font-bold uppercase">{errors.location}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Item Description</label>
                <button 
                  type="button"
                  onClick={handleAIHelp}
                  className="px-3 py-1 bg-emerald-600/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/20"
                >
                  ✨ AI Write (Free)
                </button>
              </div>
              <textarea 
                rows={5}
                className={`w-full px-5 py-4 rounded-2xl bg-[#1a1c20] border ${errors.description ? 'border-red-500' : 'border-white/5'} text-white focus:border-emerald-500 outline-none transition-all font-medium text-sm resize-none h-[150px]`}
                placeholder="Details for your buyers..."
                value={formData.description}
                onChange={e => {
                    setFormData({ ...formData, description: e.target.value });
                    if(errors.description) setErrors(prev => {const n={...prev}; delete n.description; return n;});
                }}
              />
              {errors.description && <p className="mt-2 text-red-500 text-[10px] font-bold uppercase">{errors.description}</p>}
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-[11px] font-black uppercase text-slate-500 tracking-widest">Photos</label>
                <span className={`text-[10px] font-black uppercase ${errors.images ? 'text-red-500' : 'text-emerald-500'}`}>{images.length}/{MIN_IMAGES} Required</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-[#1a1c20] border border-white/5 shadow-inner group">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                
                {images.length < 9 && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed ${errors.images ? 'border-red-500/50' : 'border-white/5'} bg-[#1a1c20] hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center text-slate-600 hover:text-emerald-500`}
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-[9px] font-black uppercase">Upload</span>
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              {errors.images && <p className="mt-2 text-red-500 text-[10px] font-bold uppercase">{errors.images}</p>}
            </div>
          </div>
        </div>

        <button 
          disabled={loading || uploading}
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-black py-5 rounded-2xl shadow-2xl transition-all text-lg flex items-center justify-center gap-4 active:scale-95"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : 'Publish Free Listing'}
        </button>
      </form>
    </div>
  );
};
