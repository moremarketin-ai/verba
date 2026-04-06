'use client';

import { useState, useEffect } from 'react';
import { AppState, HookFormat, ToneOfVoice } from '@/app/page';
import { RefreshCw, ArrowLeft, Flame, Eye, Target, Zap, BookOpen, Sword, Sparkles, Star, AlertCircle, TrendingUp, UserCheck, ShieldCheck, Heart, Clock, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step4HooksProps {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface HookVariant {
  id: string;
  text: string;
  score: number;
  triggerLabel: string;
  explanation: string;
}

const HOOK_ARCHETYPES = [
  { id: 'Katta Xato', name: 'Katta Xato', icon: AlertCircle, color: 'text-red-500' },
  { id: 'Intriga / Sir', name: 'Intriga / Sir', icon: Sparkles, color: 'text-purple-500' },
  { id: 'Statistika va Isbot', name: 'Statistika va Isbot', icon: TrendingUp, color: 'text-blue-500' },
  { id: 'Mif / Fosh qilish', name: 'Mif / Fosh qilish', icon: Sword, color: 'text-orange-500' },
  { id: 'Aniq Foyda', name: 'Aniq Foyda', icon: Zap, color: 'text-yellow-500' },
  { id: 'Qadam-ba-qadam', name: 'Qadam-ba-qadam', icon: Target, color: 'text-emerald-500' },
  { id: 'Taqqoslash', name: 'Taqqoslash', icon: ShieldCheck, color: 'text-cyan-500' },
  { id: 'Kelajakdagi natija', name: 'Kelajakdagi natija', icon: Star, color: 'text-indigo-500' },
  { id: 'Samimiy hikoya', name: 'Samimiy hikoya', icon: Heart, color: 'text-pink-500' },
  { id: 'Vaqt / Cheklov', name: 'Vaqt / Cheklov', icon: Clock, color: 'text-rose-500' },
  { id: 'Sotuvchi Hooklar', name: 'Sotuvchi Hooklar', icon: Star, color: 'text-amber-500' },
  { id: 'Shaxsiy Brend', name: 'Shaxsiy Brend', icon: UserCheck, color: 'text-teal-500' },
];

export default function Step4Hooks({ state, onUpdate, onNext, onBack }: Step4HooksProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [variants, setVariants] = useState<HookVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      setLogs(["Neyro-Ilgaklar moduli yuklanmoqda...", "Miya triggerlari tahlil qilinmoqda..."]);
      interval = setInterval(() => {
        setProgress(p => (p < 99 ? p + 0.5 : 99));
      }, 100);
      
      const fakeLogs = [
        "Pattern Interrupt algoritmi faollashtirildi...",
        "Curiosity Gap (Qiziquvchanlik) o'lchanmoqda...",
        "Psixologik zanjirlar ulanmoqda...",
        "O'zbek tilidagi eng o'tkir so'zlar tanlanmoqda..."
      ];
      const logInt = setInterval(() => {
        setLogs(prev => [fakeLogs[Math.floor(Math.random() * fakeLogs.length)], ...prev].slice(0, 4));
      }, 1500);
      return () => { clearInterval(interval); clearInterval(logInt); };
    }
  }, [loading]);

  const fetchHooks = async (format: string) => {
    if (!state.toneOfVoice) {
      alert("Iltimos, avval Ssenariy Ohangini (Tone of Voice) tanlang!");
      return;
    }
    setSelectedFormat(format);
    setLoading(true);
    try {
      const res = await fetch('/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state, hookFormat: format })
      });
      if (res.ok) {
        const data = await res.json();
        setVariants(data.hooks);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toneTypes: ToneOfVoice[] = [
    'Ekspert (Autoritet)', "Do'stona (Hikoyachi)", 'Provokatsion (Agressiv)', 'Analitik (Raqamli)'
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black font-sans tracking-tight text-white uppercase tracking-tighter">
          4. Hook (Ilgak) tanlang
        </h2>
        <p className="text-gray-400 text-sm font-medium italic">
          Tomoshabinni "Scroll" qilishdan to'xtatuvchi psixologik zarba:
        </p>
      </div>

      {!selectedFormat ? (
        <div className="flex flex-col gap-6">
          {/* Tone of Voice */}
          <div className="glass rounded-[1.5rem] p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-tight">Ssenariy Ohangi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {toneTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdate({ toneOfVoice: t })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    state.toneOfVoice === t 
                      ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className={`font-black text-sm block uppercase tracking-tighter ${state.toneOfVoice === t ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Archetypes Grid */}
          <div className={`flex flex-col gap-4 transition-all ${!state.toneOfVoice ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Psixologik Ilgak Turlari:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {HOOK_ARCHETYPES.map((arc) => (
                <button
                  key={arc.id}
                  onClick={() => fetchHooks(arc.id)}
                  className="glass p-4 rounded-xl border border-white/5 hover:border-[#C9A84C]/50 transition-all group flex flex-col items-center gap-3 text-center"
                >
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${arc.color} group-hover:scale-110 transition-transform`}>
                    <arc.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white uppercase tracking-tighter text-xs leading-tight">
                    {arc.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedFormat(null)} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
              <ArrowLeft className="w-4 h-4" /> Barcha turlar
            </button>
            <h3 className="text-[#C9A84C] font-black uppercase tracking-widest text-sm">{selectedFormat}</h3>
          </div>

          <div className="grid gap-3">
            {loading ? (
              <div className="glass rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 border border-white/5">
                <div className="w-full max-w-md">
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">Neyro-Ilgaklar generatsiyasi...</span>
                     <span className="text-xl font-black text-white">{Math.round(progress)}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#C9A84C]/50 to-[#C9A84C]"
                     />
                   </div>
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-[9px] text-gray-600">
                   {logs.map((log, i) => <p key={i}>{'>'} {log}</p>)}
                </div>
              </div>
            ) : (
              variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => onUpdate({ hookText: variant.text, hookFormat: selectedFormat as HookFormat })}
                  className={`glass p-5 rounded-xl border transition-all text-left group relative overflow-hidden ${
                    state.hookText === variant.text 
                      ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center text-[10px] font-black">
                          #{index + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black uppercase tracking-widest">
                          {variant.triggerLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold">
                        <Flame className="w-3 h-3" /> {variant.score}% Viral
                      </div>
                    </div>
                    <p className={`text-lg font-black leading-tight uppercase tracking-tight ${state.hookText === variant.text ? 'text-[#C9A84C]' : 'text-white'}`}>
                      "{variant.text}"
                    </p>
                    <p className="text-gray-500 text-[11px] font-medium leading-relaxed italic">
                      💡 {variant.explanation}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* CTA / Lead Magnet Section (Visible only when hook is selected) */}
          <AnimatePresence>
            {state.hookText && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col gap-8"
              >
                <div className="h-px w-full bg-white/5" />
                
                {/* Main Choice: Lead Magnet vs No Lead Magnet */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      5. Video yakuni va Qiymat
                    </h3>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-none">
                      Videoda qanday qiymat bermoqchisiz?
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => onUpdate({ leadMagnetUsage: 'with', selectedCTA: null, ctaText: '' })}
                      className={`p-6 rounded-[1.5rem] border flex flex-col gap-3 transition-all ${
                        state.leadMagnetUsage === 'with'
                          ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${state.leadMagnetUsage === 'with' ? 'bg-[#C9A84C] text-black' : 'bg-white/5 text-gray-500'}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className={`font-black text-sm uppercase tracking-tighter ${state.leadMagnetUsage === 'with' ? 'text-white' : 'text-gray-400'}`}>Lead Magnet Bilan</p>
                          <p className="text-[10px] text-gray-500 font-medium tracking-tight">Komentariya yoki link orqali sovg'a berish</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onUpdate({ leadMagnetUsage: 'without', selectedCTA: 'none', ctaText: 'Hech qanday CTA yo\'q, barcha qiymat videoning o\'zida berildi.' })}
                      className={`p-6 rounded-[1.5rem] border flex flex-col gap-3 transition-all ${
                        state.leadMagnetUsage === 'without'
                          ? 'border-emerald-500 bg-emerald-500/5'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${state.leadMagnetUsage === 'without' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className={`font-black text-sm uppercase tracking-tighter ${state.leadMagnetUsage === 'without' ? 'text-white' : 'text-gray-400'}`}>Lead Magnetsiz</p>
                          <p className="text-[10px] text-gray-500 font-medium tracking-tight">Barcha qiymat ssenariyning o'zida (No CTA)</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {state.leadMagnetUsage === 'with' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col gap-2">
                       <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">Sovg'a turini tanlang:</p>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { id: 'pdf', label: 'PDF Guide', icon: BookOpen },
                            { id: 'video_link', label: 'Video Dars', icon: Eye },
                            { id: 'article', label: 'Maqola/Post', icon: BookOpen },
                            { id: 'site_link', label: 'Sayt/Link', icon: Target },
                          ].map((type) => (
                            <button
                              key={type.id}
                              onClick={() => {
                                onUpdate({ leadMagnetType: type.id as any, selectedCTA: null, ctaText: '' });
                              }}
                              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                state.leadMagnetType === type.id 
                                  ? 'border-[#C9A84C] bg-[#C9A84C]/10' 
                                  : 'border-white/5 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <type.icon className={`w-4 h-4 ${state.leadMagnetType === type.id ? 'text-[#C9A84C]' : 'text-gray-500'}`} />
                              <span className={`text-[10px] font-black uppercase tracking-tight ${state.leadMagnetType === type.id ? 'text-white' : 'text-gray-500'}`}>{type.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    {state.leadMagnetType && (
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Harakatga chaqiriq (CTA) usuli:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { id: 'comment', label: 'Komentariya', icon: Sparkles, template: 'Komentariyda "[WORD]" deb yozing, men sizga [TYPE]ni yuboraman!' },
                            { id: 'link', label: 'Profil Linki', icon: Target, template: 'Profilimga o\'tgan holda, link ustiga bosing va tayyor [WORD] materialni yuklab oling!' },
                            { id: 'direct', label: 'Direkt', icon: Send, template: 'Menga direktga "[WORD]" so\'zini yozing, [TYPE]ni tashlab beraman!' },
                            { id: 'follow', label: 'Obuna', icon: UserCheck, template: 'Menga obuna bo\'ling va "[WORD]" so\'zini yozing, sizga [TYPE] sovg\'am bor!' },
                          ].map((cta) => (
                            <button
                              key={cta.id}
                              onClick={() => {
                                const word = state.ctaText.split('"')[1] || state.niche.toUpperCase() || 'GUIDE';
                                const typeLabel = 
                                  state.leadMagnetType === 'pdf' ? 'PDF qo\'llanma' : 
                                  state.leadMagnetType === 'video_link' ? 'video darslik' : 
                                  state.leadMagnetType === 'article' ? 'maqola' : 'material';
                                onUpdate({ 
                                  selectedCTA: cta.id, 
                                  ctaText: cta.template.replace('[WORD]', word).replace('[TYPE]', typeLabel)
                                });
                              }}
                              className={`p-4 rounded-xl border text-left transition-all ${
                                state.selectedCTA === cta.id 
                                  ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
                                  : 'border-white/5 bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded bg-white/5 flex items-center justify-center ${state.selectedCTA === cta.id ? 'text-[#C9A84C]' : 'text-gray-500'}`}>
                                  <cta.icon className="w-4 h-4" />
                                </div>
                                <span className={`font-black text-xs uppercase tracking-widest ${state.selectedCTA === cta.id ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                                  {cta.label}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {state.selectedCTA && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kalit so'z yoki Manba (Keyword/Link):</label>
                           <input 
                             type="text"
                             placeholder="Masalan: START, REELS yoki t.me/link"
                             className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold uppercase tracking-widest outline-none focus:border-[#C9A84C]/50 transition-all text-sm"
                             onChange={(e) => {
                                const word = e.target.value || '...';
                                const typeLabel = 
                                  state.leadMagnetType === 'pdf' ? 'PDF qo\'llanma' : 
                                  state.leadMagnetType === 'video_link' ? 'video darslik' : 
                                  state.leadMagnetType === 'article' ? 'maqola' : 'material';
                                const currentTemplate = [
                                  { id: 'comment', template: 'Komentariyda "[WORD]" deb yozing, men sizga [TYPE]ni yuboraman!' },
                                  { id: 'link', template: 'Profilimga o\'tgan holda, link ustiga bosing va tayyor [WORD] materialni yuklab oling!' },
                                  { id: 'direct', template: 'Menga direktga "[WORD]" so\'zini yozing, [TYPE]ni tashlab beraman!' },
                                  { id: 'follow', template: 'Menga obuna bo\'ling va "[WORD]" so\'zini yozing, sizga [TYPE] sovg\'am bor!' },
                                ].find(c => c.id === state.selectedCTA)?.template || '[WORD]';
                                
                                onUpdate({ ctaText: currentTemplate.replace('[WORD]', word).replace('[TYPE]', typeLabel) });
                             }}
                           />
                        </div>
                        
                        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                           <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">CTA Preview:</p>
                           <p className="text-sm font-medium text-white italic leading-relaxed">
                             "{state.ctaText}"
                           </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {state.leadMagnetUsage === 'without' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4"
                  >
                    <Zap className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <p className="text-white font-black text-sm uppercase tracking-tight">To'g'ridan-to'g'ri qiymat rejimi</p>
                      <p className="text-emerald-500/70 text-[11px] font-medium leading-tight">
                        AI videoning o'zida barcha kerakli ma'lumotlarni (insaytlarni) beradi. CTA o'rniga videoni yakunlovchi kuchli xulosa yoziladi.
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button onClick={onBack} className="px-8 py-4 bg-white/5 rounded-2xl text-white font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
              ← Orqaga
            </button>
            <button 
              onClick={onNext}
              disabled={!state.hookText || (state.leadMagnetUsage === 'with' && (!state.selectedCTA || !state.leadMagnetType))}
              className="px-12 py-4 bg-[#C9A84C] text-black rounded-2xl font-black hover:bg-[#E0C16C] transition-all disabled:opacity-30 uppercase tracking-widest text-xs"
            >
              Keyingi Bosqich →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
