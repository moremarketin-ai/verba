'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Flame, CheckCircle2, Globe, Sparkles, Video, ExternalLink, Link2, Search, Zap, Award, List, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { TopicMode } from '@/app/page';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisResult {
  successSecret: string;
  hookAnalysis: string;
  structureAnalysis: string;
  viralScore: number;
}

interface TopicCard {
  id: string;
  title: string;
  description: string;
  sourceName: string;
  links?: string[];
  linksAreSearch?: boolean;
  painLevel?: number;
  type: 'trending' | 'proven';
}

interface Step2Props {
  niche: string;
  onNext: (title: string, desc: string, sourceName?: string) => void;
  onBack: () => void;
}

export default function Step2Topics({ niche, onNext, onBack }: Step2Props) {
  const [mode, setMode] = useState<TopicMode | 'all'>('all');
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzingUrl, setAnalyzingUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  
  const [progress, setProgress] = useState(0);
  const [customTopic, setCustomTopic] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const analyzeVideo = async (url: string, title: string) => {
    setIsAnalyzing(true);
    setAnalyzingUrl(url);
    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url, topicTitle: title })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error(err);
    }
    setIsAnalyzing(false);
  };

  const fakeUrls = [
    "Google Search Grounding faollashtirildi...",
    "Gemini 2.5 Pro orqali internet skaner qilinmoqda...",
    "YouTube va Instagram viral videolari qidirilmoqda...",
    "Reddit va LinkedIn Trendlari tahlil qilinmoqda...",
    "Global marketing forumlari va Twitter trendlari ko'zdan kechirilmoqda...",
    `${niche} sohasidagi eng yangi va viral havolalar yig'ilmoqda...`,
    "Real-vaqtdagi trendlar o'zbekchalashtirilmoqda...",
    "Mavjud muammolar va linklar mantiqiy saralanmoqda...",
  ];

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let urlInterval: NodeJS.Timeout;

    if (loading) {
      setProgress(0);
      setLogs(["Deep-Search tizimi ishga tushirildi (Gemini 2.0)...", `${niche} bo'yicha jonli qidiruv boshlandi...`]);
      
      interval = setInterval(() => {
        setProgress(p => {
          if (p < 40) return p + 3; 
          if (p < 85) return p + 0.8; 
          if (p < 99) return p + 0.2; 
          return 99;
        });
      }, 200);

      urlInterval = setInterval(() => {
        const nextUrl = fakeUrls[Math.floor(Math.random() * fakeUrls.length)];
        setCurrentUrl(nextUrl);
        if (Math.random() > 0.6) addLog(nextUrl);
      }, 1200);

    } else {
      setProgress(100);
      setCurrentUrl("Qidiruv yakunlandi.");
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(urlInterval);
    };
  }, [loading, niche]);

  const fetchTopics = async (targetMode: string, isRefresh = false) => {
    setLoading(true);
    setErrorMsg('');
    addLog(`Qidiruv: ${niche} uchun ${targetMode === 'all' ? 'barcha' : targetMode} trendlar...`);
    
    try {
      const res = await fetch(`/api/topics?mode=${targetMode}&refresh=${isRefresh ? Date.now() : ''}&niche=${encodeURIComponent(niche)}`);
      
      if (res.ok) {
        const data = await res.json();
        setTopics(data.topics || []);
        if (!data.topics || data.topics.length === 0) {
           setErrorMsg('Hech qanday ma\'lumot topilmadi. Qidiruvni qaytadan boshlang.');
        } else {
           addLog(`${data.topics.length} ta real trend topildi!`);
        }
      } else {
        const err = await res.json();
        setErrorMsg('Xatolik: ' + (err.error || 'API Javob bermadi'));
      }
    } catch (error: any) {
      setErrorMsg('Tarmoq xatosi. Iltimos qayta urinib ko\'ring.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics(mode);
  }, [mode]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Standard Top Navigation Bar */}
      <div className="flex w-full justify-between items-center mb-2 pb-4 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white text-[11px] font-black uppercase tracking-widest border border-white/5">
          <ArrowLeft className="w-4 h-4" /> Ortga qaytish
        </button>
        <button 
          onClick={() => fetchTopics(mode, true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111] hover:bg-[#222] border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 hover:border-[#C9A84C]/40 group text-white"
        >
          <RefreshCw className={`w-4 h-4 text-[#C9A84C] ${loading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} /> 
          Yangilash
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-black font-sans tracking-tight text-white uppercase tracking-tighter leading-none">2. {niche} trendlari</h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Globe className="w-3 h-3" /> Live Search
              </div>
            </div>
            <p className="text-gray-400 text-lg font-medium italic">Gemini 2.0 orqali real-vaqtdagi tahlil</p>
        </div>
      </div>

      <div className="flex p-1 bg-[#111] rounded-xl border border-white/5 w-fit">
        <button 
          onClick={() => setMode('all')}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'all' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Barchasi
        </button>
        <button 
          onClick={() => setMode('trending')}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'trending' ? 'bg-[#222] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Flame className="w-4 h-4 text-orange-500" /> Dolzarb
        </button>
        <button 
          onClick={() => setMode('proven')}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'proven' ? 'bg-[#222] text-[#C9A84C] shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <CheckCircle2 className="w-4 h-4" /> Ishlaydigan
        </button>
      </div>

      {errorMsg && (
        <div className="p-5 rounded-xl bg-red-900/20 border border-red-500/30 text-red-100 text-sm">
          <p className="font-medium text-center">⚠️ {errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 text-center text-gray-400 border border-white/5 bg-[#111] rounded-2xl glass">
            <div className="w-full max-w-md mx-auto relative mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-[#C9A84C] flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]"></span>
                  </span>
                  AI Analiz jarayonida...
                </span>
                <span className="text-lg font-bold text-white ml-4">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-gradient-to-r from-[#C9A84C]/50 to-[#C9A84C] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="mt-4 p-4 rounded-xl bg-[#050505] border border-white/5 flex flex-col gap-2 shadow-inner font-mono text-[11px] text-left">
                {logs.map((log, i) => (
                  <p key={i} className={`truncate ${i === 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    <span className="opacity-50 mr-2">{'>'}</span> {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          topics.map((topic) => (
            <div 
              key={topic.id} 
              onClick={() => onNext(topic.title, topic.description, topic.sourceName)}
              className="glass rounded-xl p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:border-[#C9A84C]/50 hover:shadow-[0_10px_30px_rgba(201,168,76,0.1)] group flex flex-col items-start relative overflow-hidden text-left"
            >
              <div className="flex flex-wrap items-center gap-1.5 mb-3 w-full relative z-10">
                {topic.type === 'trending' ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                    <Flame className="w-3 h-3" /> Trending
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> Proven
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-gray-500 text-[10px] font-medium border border-white/5">
                  📍 {topic.sourceName}
                </span>
                {topic.painLevel && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 ml-auto">
                    Pain: {topic.painLevel}/10
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2 text-white group-hover:text-[#C9A84C] transition-all leading-tight uppercase tracking-tight relative z-10">
                {topic.title}
              </h3>
              <p className="text-gray-400 text-[13px] leading-relaxed mb-4 flex-1 group-hover:text-white/90 transition-colors relative z-10 font-medium">
                {topic.description}
              </p>

              {topic.links && topic.links.length > 0 && (
                <div className="w-full flex flex-col gap-2 mb-4 relative z-20">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    {topic.linksAreSearch ? 'Qidiruv:' : 'Haqiqiy Manbalar:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {topic.linksAreSearch ? (
                      // Search fallback — always-working YouTube search link
                      <a
                        href={topic.links[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 transition-all group/yt"
                      >
                        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/>
                        </svg>
                        <span className="text-[10px] font-black text-red-400 group-hover/yt:text-white uppercase tracking-tight">YouTube-da bu mavzuni ko'rish</span>
                        <ExternalLink className="w-2.5 h-2.5 text-red-500/50" />
                      </a>
                    ) : (
                      // Real grounding links from Gemini citations
                      topic.links.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <a 
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all text-emerald-400"
                          >
                            <Link2 className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-tight">Manba #{idx + 1}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              analyzeVideo(link, topic.title);
                            }}
                            className="p-1.5 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all border border-[#C9A84C]/20"
                            title="AI Tahlili"
                          >
                            {isAnalyzing && analyzingUrl === link ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Search className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="w-full flex items-center justify-between border-t border-white/5 pt-3 mt-auto relative z-10">
                <div className="text-[#C9A84C] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Tanlash <span>→</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.title)}`, '_blank');
                  }}
                  className="text-[9px] font-bold text-gray-600 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest"
                >
                  <Globe className="w-3 h-3" /> Manbani tekshirish
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Analysis Modal */}
      <AnimatePresence>
        {analysisResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnalysisResult(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl glass rounded-[2.5rem] border border-[#C9A84C]/20 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <div className="p-1 px-4 flex justify-between items-center border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#C9A84C] fill-[#C9A84C]/20" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Neural Content DNA</span>
                </div>
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="p-3 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 md:p-10 flex flex-col gap-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Success Secret */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-orange-400" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Muvaffaqiyat Siri</h4>
                  </div>
                  <p className="text-gray-300 text-[13px] leading-relaxed p-5 rounded-3xl bg-white/5 border border-white/5 italic font-medium">
                    "{analysisResult.successSecret}"
                  </p>
                </div>

                {/* Hook Analysis */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Viral Hook Tahlili</h4>
                  </div>
                  <p className="text-gray-300 text-[13px] leading-relaxed p-5 rounded-3xl bg-white/5 border border-white/5">
                    {analysisResult.hookAnalysis}
                  </p>
                </div>

                {/* Structure Analysis */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <List className="w-4 h-4 text-blue-400" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Ssenariy Strukturasi</h4>
                  </div>
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                    <p className="text-gray-300 text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
                      {analysisResult.structureAnalysis}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between p-5 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#C9A84C] uppercase tracking-[0.2em]">Viral Potential Score</span>
                    <span className="text-[10px] text-[#C9A84C]/60 italic font-bold">Deep AI Simulation Prediction</span>
                  </div>
                  <span className="text-3xl font-black text-white tracking-tighter">{analysisResult.viralScore}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!loading && topics.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/5">
          <h3 className="text-xl font-bold mb-4 text-white/90 uppercase tracking-tighter">...yoki o'z maqsad va mavzuingizni yozing:</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder={`Masalan: Yangi ${niche} kolleksiyasini sotish uchun...`}
              className="flex-1 bg-[#141414] border border-white/10 rounded-2xl px-5 py-4 focus:border-[#C9A84C] outline-none transition-colors text-white/90 placeholder:text-gray-700 font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customTopic.trim()) {
                  onNext(customTopic, `Custom ${niche} maqsadi`);
                }
              }}
            />
            <button 
              onClick={() => customTopic.trim() && onNext(customTopic, `Custom ${niche} maqsadi`)}
              disabled={!customTopic.trim()}
              className="px-10 py-5 bg-[#C9A84C] text-black font-black rounded-2xl hover:bg-[#E0C16C] transition-all uppercase tracking-widest text-[10px]"
            >
              Davom etish →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
