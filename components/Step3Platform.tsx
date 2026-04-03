'use client';

import { 
  Camera, 
  Play, 
  Briefcase, 
  Send, 
  Zap, 
  Layout, 
  Video, 
  Type,
  Sparkles,
  Target,
  BookOpen,
  Sword,
  CheckCircle2
} from 'lucide-react';
import { AppState, Platform, ContentType, Skill } from '@/app/page';

interface Step3Props {
  state: AppState;
  onUpdate: (updates: Partial<AppState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PLATFORMS = [
  { id: 'Instagram' as Platform, icon: Camera, color: 'text-pink-500' },
  { id: 'YouTube' as Platform, icon: Play, color: 'text-red-500' },
  { id: 'LinkedIn' as Platform, icon: Briefcase, color: 'text-blue-600' },
  { id: 'Telegram' as Platform, icon: Send, color: 'text-sky-500' },
  { id: 'Twitter' as Platform, icon: Zap, color: 'text-white' },
  { id: 'Facebook' as Platform, icon: Layout, color: 'text-blue-700' },
];

const SKILLS = [
  { id: 'PAS', name: 'PAS', desc: "Muammo → Kuchaytirish → Yechim. Og'riqqa urish orqali sotish.", icon: Target },
  { id: 'AIDA', name: 'AIDA', desc: "E'tibor → Qiziqish → Xohish → Harakat. Klassik sotuv bosqichlari.", icon: Zap },
  { id: 'Storytelling', name: 'Hikoya', desc: "Hikoya orqali bog'lanish va hissiy sotuv.", icon: BookOpen },
  { id: 'Challenger', name: 'Teskari fikr', desc: "Sohadagi miflarni buzib, odamlarni hayratga solish.", icon: Sword },
];

export default function Step3Platform({ state, onUpdate, onNext, onBack }: Step3Props) {
  const selectedPlatforms = state.platforms || [];
  
  const togglePlatform = (platformId: Platform) => {
    const current = [...selectedPlatforms];
    const idx = current.indexOf(platformId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(platformId);
    }
    // Also set platform to first selected for backward compat (hooks/script use it)
    onUpdate({ platforms: current, platform: current[0] || null });
  };

  // Determine slider range based on selected platforms
  const hasYouTube = selectedPlatforms.includes('YouTube');
  const hasInstagram = selectedPlatforms.includes('Instagram');
  
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
            ←
          </button>
          <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black font-sans tracking-tight text-white uppercase tracking-tighter leading-none">3. Platformalar va strategiya</h2>
              <p className="text-gray-400 text-lg font-medium italic">Bir nechta platformani tanlang — har biri uchun alohida ssenariy yoziladi</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Platform multi-select */}
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block">Platformalarni tanlang (bir nechta)</span>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);
              
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 relative ${
                    isSelected 
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10' 
                      : 'border-white/5 bg-[#111] hover:border-white/20'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
                    </div>
                  )}
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-[#C9A84C]' : platform.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {platform.id}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedPlatforms.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#C9A84C]">
                {selectedPlatforms.length} ta tanlandi:
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                {selectedPlatforms.join(' • ')}
              </span>
            </div>
          )}
        </div>

        {selectedPlatforms.length > 0 && (
          <div className="flex flex-col gap-8 mt-4 animate-in zoom-in duration-300">
            {/* Content Type */}
            <div className="flex flex-col gap-4 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">Formatni tanlang</span>
              <div className="flex gap-3">
                {[
                  { id: 'Video', icon: Video, label: 'Video (Reels/Shorts)' },
                  { id: 'Matn', icon: Type, label: 'Matnli Post' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onUpdate({ contentType: type.id as ContentType })}
                    className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                      state.contentType === type.id 
                        ? 'border-[#C9A84C] bg-[#C9A84C]/5 text-white' 
                        : 'border-white/5 bg-[#111] text-gray-500 hover:border-white/10'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 ${state.contentType === type.id ? 'text-[#C9A84C]' : ''}`} />
                    <span className="font-bold uppercase tracking-widest text-[10px] text-center">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Strategic Skill Mode */}
            <div className="flex flex-col gap-3 text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">Strategik usul</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SKILLS.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => onUpdate({ selectedSkill: skill.id as Skill })}
                    className={`p-4 rounded-xl border transition-all text-left flex gap-4 ${
                      state.selectedSkill === skill.id 
                        ? 'border-[#C9A84C] bg-[#C9A84C]/5' 
                        : 'border-white/5 bg-[#111] hover:border-white/10'
                    } group`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      state.selectedSkill === skill.id ? 'bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.5)]' : 'bg-white/5 text-gray-600 group-hover:text-gray-400'
                    }`}>
                      <skill.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className={`font-black tracking-tighter text-lg uppercase ${
                        state.selectedSkill === skill.id ? 'text-white' : 'text-gray-500'
                      }`}>{skill.name}</span>
                      <p className="text-gray-500 text-[11px] leading-tight font-medium italic">{skill.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Sliders for each platform */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]">Har bir platforma uchun davomiylik</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPlatforms.map((platformId) => {
                  const platformData = PLATFORMS.find(p => p.id === platformId);
                  const settings = state.platformSettings[platformId] || { sliderValue: 60 };
                  
                  const isYouTube = platformId === 'YouTube';
                  const isInstagram = platformId === 'Instagram';
                  
                  const min = isYouTube ? 300 : 15;
                  const max = isYouTube ? 1500 : isInstagram ? 90 : 300;
                  const step = isYouTube ? 30 : 5;

                  return (
                    <div key={platformId} className="flex flex-col gap-4 p-5 glass rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white/5`}>
                            {platformData && <platformData.icon className={`w-4 h-4 ${platformData.color}`} />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">{platformId}</span>
                        </div>
                        <span className="text-[#C9A84C] text-[13px] font-black italic">
                          {isYouTube 
                            ? `${Math.floor(settings.sliderValue / 60)}:${(settings.sliderValue % 60).toString().padStart(2, '0')} min` 
                            : `${settings.sliderValue} sek`}
                        </span>
                      </div>

                      <div className="relative pt-1">
                        <input
                          type="range"
                          min={min}
                          max={max}
                          step={step}
                          value={settings.sliderValue}
                          onChange={(e) => {
                            const newVal = parseInt(e.target.value);
                            onUpdate({
                              platformSettings: {
                                ...state.platformSettings,
                                [platformId]: { sliderValue: newVal }
                              }
                            });
                          }}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#C9A84C] hover:accent-[#E0C16C] transition-all"
                        />
                        <div className="flex justify-between mt-2 text-[8px] font-bold text-gray-600 uppercase tracking-tighter">
                          <span>{isYouTube ? '5m' : '15s'}</span>
                          <span>{isYouTube ? '25m' : isInstagram ? '90s' : '5m'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={onNext}
              disabled={selectedPlatforms.length === 0 || !state.contentType}
              className="mt-4 w-full py-6 bg-[#C9A84C] text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#E0C16C] transition-all disabled:opacity-30 disabled:grayscale shadow-[0_10px_30px_rgba(201,168,76,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Keyingi Bosqich →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
