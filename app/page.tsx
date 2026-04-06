'use client';

import { useState, useRef, useEffect } from 'react';
import Step1Niche from '@/components/Step1Niche';
import Step2Topics from '@/components/Step2Topics';
import Step3Platform from '@/components/Step3Platform';
import Step4Hooks from '@/components/Step4Hooks';
import Step5Script from '@/components/Step5Script';
import { 
  Camera, 
  Play, 
  Briefcase, 
  Send, 
  Zap, 
  Layout, 
  Sparkles,
  PenTool,
  X
} from 'lucide-react';

export type TopicMode = 'trending' | 'proven';
export type Platform = 'Instagram' | 'YouTube' | 'LinkedIn' | 'Telegram' | 'Twitter' | 'Facebook';
export type ContentType = 'Video' | 'Matn' | 'Barchasi';
export type HookFormat = 'Muammo' | 'Statistika' | 'Savol' | 'Natija' | "Yolg'onni fosh qilish" | 'Qiziqtirish' | 'Hikoya' | 'Qarama-qarshilik' | 'Shoshilinch' | "Ro'yxat" | 'Taqqoslash' | 'Bonus';
export type ToneOfVoice = 'Ekspert (Autoritet)' | "Do'stona (Hikoyachi)" | 'Provokatsion (Agressiv)' | 'Analitik (Raqamli)';
export type Skill = 'PAS' | 'AIDA' | 'Storytelling' | 'Challenger';

export interface AppState {
  step: number;
  topicTitle: string;
  topicDesc: string;
  sourceName: string;
  platform: Platform | null;
  platforms: Platform[];
  platformSettings: Record<string, { sliderValue: number }>;
  contentType: ContentType | null;
  sliderValue: number;
  hookFormat: HookFormat | null;
  hookText: string;
  toneOfVoice: ToneOfVoice | null;
  selectedSkill: Skill | null;
  niche: string;
  selectedCTA: string | null;
  ctaText: string;
}

export default function WizardPage() {
  const PLATFORMS_LIST = [
    { id: 'Instagram', icon: Camera, color: 'text-pink-500' },
    { id: 'YouTube', icon: Play, color: 'text-red-500' },
    { id: 'LinkedIn', icon: Briefcase, color: 'text-blue-600' },
    { id: 'Telegram', icon: Send, color: 'text-sky-500' },
    { id: 'Twitter', icon: Zap, color: 'text-white' },
    { id: 'Facebook', icon: Layout, color: 'text-blue-700' },
  ];

  const [state, setState] = useState<AppState>({
    step: 1,
    topicTitle: '',
    topicDesc: '',
    sourceName: '',
    platform: null,
    platforms: [],
    platformSettings: {
      'YouTube': { sliderValue: 600 },
      'Instagram': { sliderValue: 60 },
      'LinkedIn': { sliderValue: 180 },
      'Telegram': { sliderValue: 180 },
      'Twitter': { sliderValue: 45 },
      'Facebook': { sliderValue: 180 },
    },
    contentType: null,
    sliderValue: 60,
    hookFormat: null,
    hookText: '',
    toneOfVoice: null,
    selectedSkill: 'PAS',
    niche: '',
    selectedCTA: null,
    ctaText: '',
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customGoal, setCustomGoal] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => updateState({ step: state.step + 1 });
  const prevStep = () => updateState({ step: Math.max(1, state.step - 1) });

  const handleCustomGoalSubmit = () => {
    if (!customGoal.trim()) return;
    updateState({
      topicTitle: "Maxsus Maqsad",
      topicDesc: customGoal,
      step: 2, // Jump to platform selection
      platform: null,
      contentType: null
    });
    setIsDrawerOpen(false);
    setCustomGoal('');
  };

  return (
    <div className="w-full flex-1 flex flex-col pt-8 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
      
      {/* Step Indicator */}
      <div className="flex justify-between mb-10 relative px-4 md:px-10">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0"></div>
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
              state.step >= s 
                ? 'bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                : 'bg-[#0a0a0a] text-gray-600 border border-white/5'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

        {state.step === 1 && (
          <Step1Niche 
            onNext={(niche: string) => {
              updateState({ niche, step: 2 });
            }} 
          />
        )}

        {state.step === 2 && (
          <Step2Topics 
            niche={state.niche}
            onNext={(title: string, desc: string, sourceName?: string) => {
              updateState({ topicTitle: title, topicDesc: desc, sourceName: sourceName || '', step: 3 });
            }} 
            onBack={prevStep}
          />
        )}
        
        {state.step === 3 && (
          <Step3Platform 
            state={state} 
            onUpdate={updateState} 
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
 
        {state.step === 4 && (
          <Step4Hooks 
            state={state} 
            onUpdate={updateState} 
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
 
        {state.step === 5 && (
          <Step5Script 
            state={state} 
            onBack={prevStep}
          />
        )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#C9A84C] text-black rounded-full shadow-[0_4px_20px_rgba(201,168,76,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-[100] group"
      >
        <PenTool className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Custom Goal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in duration-300">
          <div 
            ref={drawerRef}
            className="fixed bottom-0 left-0 w-full bg-[#0d0d0d] border-t border-[#C9A84C]/30 rounded-t-[2.5rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C9A84C]/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">O'zim yozaman</h2>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-400 mb-6">
                Trendlarni chetlab o'tib, o'z kontent g'oyangiz yoki marketing maqsadingizni to'g'ridan-to'g'ri yozing. 
                AI aynan siz aytgan mavzuda professional ssenariy tayyorlaydi.
              </p>

              <div className="relative">
                <textarea
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Masalan: Yangi ochilgan qahvaxona uchun 15% chegirma e'lon qilish va mijozlarni chaqirish..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A84C]/50 transition-all resize-none text-lg"
                />
                <button
                  onClick={handleCustomGoalSubmit}
                  disabled={!customGoal.trim()}
                  className="absolute bottom-4 right-4 bg-[#C9A84C] text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  Yuborish <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
