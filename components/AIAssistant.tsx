
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { motion, useDragControls } from 'framer-motion';
import { generateSpeech, decodeBase64, decodeAudioData, scanForOffPlatformManeuvers } from '../services/geminiService';
import { AiSettings } from '../types';

interface AIAssistantProps {
  externalTrigger?: number;
  aiSettings: AiSettings;
}

function encodePCM(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ externalTrigger = 0, aiSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (externalTrigger > 0) {
      setIsOpen(true);
      if (messages.length === 0) handleOnboarding();
    }
  }, [externalTrigger]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isTyping]);

  const stopLiveSession = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    setIsLive(false);
    for (const source of audioSourcesRef.current) source.stop();
    audioSourcesRef.current.clear();
  };

  const startLiveSession = async () => {
    if (isLive) {
      stopLiveSession();
      return;
    }
    setIsLive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outCtx = audioContextRef.current;

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: async () => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const inCtx = new AudioContext({ sampleRate: 16000 });
          const source = inCtx.createMediaStreamSource(stream);
          const processor = inCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(session => session.sendRealtimeInput({ media: { data: encodePCM(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(processor);
          processor.connect(inCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
            const audioData = decodeBase64(base64Audio);
            const audioBuffer = await decodeAudioData(audioData, outCtx, 24000, 1);
            const source = outCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            audioSourcesRef.current.add(source);
            source.onended = () => audioSourcesRef.current.delete(source);
          }
        },
        onclose: () => setIsLive(false),
        onerror: () => setIsLive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: aiSettings.voiceName } } },
        systemInstruction: `You are NairaIntelligence. Persona: ${aiSettings.personality}. You are fun, savvy, and sharp. Protect Nigerians from scams. Warn about off-platform physical cash maneuvers.`
      }
    });
    liveSessionRef.current = await sessionPromise;
  };

  const handleOnboarding = () => {
    setIsOpen(true);
    setMessages([{ role: 'ai', text: "NairaIntelligence Online. Ready to hunt for deals?" }]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsTyping(true);
    
    // Safety Scan
    const safetyCheck = await scanForOffPlatformManeuvers(userMsg);
    if (safetyCheck.isManeuver) {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `⚠️ PROTOCOL BREACH: ${safetyCheck.warningMessage || "Off-platform maneuvers detected. Your account trust velocity has been penalized. Stay in the Aura to remain protected."}` 
      }]);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: "You are 'NairaIntelligence™'. High-energy assistant. Warn users about off-platform cash deals." }
      });
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Recalibrating..." }]);
    } catch (e) {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[320px] sm:w-[400px] h-[500px] sm:h-[650px] glass-card rounded-[2rem] sm:rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in slide-in-from-bottom-12 duration-500">
          <div className="h-20 sm:h-24 px-6 sm:px-8 flex items-center justify-between border-b border-white/5 bg-emerald-500/5">
             <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isLive ? 'bg-emerald-500 shadow-[0_0_30px_#10b981]' : 'bg-white/10'}`}>
                   <span className="text-lg sm:text-xl">{isLive ? '🎙️' : '✨'}</span>
                </div>
                <div>
                   <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">{isLive ? 'Live Voice' : 'Intelligence'}</h3>
                   <span className="text-[9px] sm:text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">{isLive ? 'Streaming...' : 'IDLE'}</span>
                </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4 sm:space-y-6 custom-scrollbar bg-black/10">
            {isLive ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8 sm:space-y-10 animate-pulse">
                <div className="flex items-end gap-1.5 sm:gap-2 h-16 sm:h-20">
                   {[...Array(8)].map((_, i) => (
                     <div key={i} className="w-1 sm:w-1.5 bg-emerald-500 rounded-full" style={{ height: `${Math.random() * 80 + 20}%`, animation: `bounce 1s infinite ${i * 0.1}s` }}></div>
                   ))}
                </div>
                <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] text-center max-w-xs leading-loose">The Orb is listening. Speak clearly about the marketplace.</p>
                <button onClick={stopLiveSession} className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all shadow-2xl">Kill Link</button>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 sm:px-6 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] text-[12px] sm:text-[13px] font-bold leading-relaxed shadow-xl ${
                    m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-200 border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {isTyping && <div className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Neural Link Active...</div>}
          </div>

          {!isLive && (
            <div className="p-6 sm:p-8 bg-black/40 border-t border-white/5">
              <div className="flex gap-3 sm:gap-4">
                <input 
                  type="text" 
                  placeholder="Ask anything..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-white focus:border-emerald-500/50 outline-none transition-all"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={startLiveSession} className="bg-emerald-500/10 text-emerald-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-emerald-500 hover:text-black transition-all active:scale-90">
                   <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v10a3 3 0 01-3 3 3 3 0 01-3-3V7a3 3 0 013-3z" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <motion.button 
        drag
        dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-700 shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-90 group relative cursor-grab active:cursor-grabbing ${isOpen ? 'bg-white text-black' : 'bg-emerald-500 text-black'}`}
      >
        <div className="absolute -inset-2 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
        {isOpen ? (
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <span className="text-2xl sm:text-3xl font-black">N</span>
        )}
      </motion.button>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(2); } }
      `}</style>
    </div>
  );
};
