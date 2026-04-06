'use client';

import { useState, useEffect } from 'react';
import { AppState } from '@/app/page';
import { Copy, Download, RefreshCcw, Edit3, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step5Props {
  state: AppState;
  onBack: () => void;
}

export default function Step5Script({ state, onBack }: Step5Props) {
  const [scripts, setScripts] = useState<Record<string, string>>({});
  const [leadMagnets, setLeadMagnets] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [visualPrompts, setVisualPrompts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let logInterval: NodeJS.Timeout;

    if (loading) {
      setProgress(0);
      setLogs(["AI Neyronlari qizitilmoqda...", "Niche tahlil qilinmoqda..."]);
      
      interval = setInterval(() => {
        setProgress(p => {
          if (p < 30) return p + 1.5; 
          if (p < 85) return p + 0.3; 
          if (p < 99) return p + 0.05; 
          return 99;
        });
      }, 300);

      const fakeSteps = [
        "Jumlalardagi 'suv'lar siqib chiqarilmoqda...",
        "Qimmat copywriting usullari qo'llanilmoqda...",
        "Hook mantiqiy davom ettirilmoqda...",
        "Psixologik triggerlar joylashtirilyapti...",
        "Lead Magnet tayyorlanmoqda...",
        "Visual promptlar generatsiya qilinyapti...",
        "AI Ssenariy yakunlanmoqda..."
      ];

      logInterval = setInterval(() => {
        const nextLog = fakeSteps[Math.floor(Math.random() * fakeSteps.length)];
        setLogs(prev => [nextLog, ...prev].slice(0, 4));
      }, 2000);

    } else {
      setProgress(100);
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [loading]);

  const generateScript = async () => {
    setLoading(true);
    setVisualPrompts([]);
    setScripts({});
    setLeadMagnets({});
    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });

      if (res.ok) {
        const data = await res.json();
        setScripts(data.scripts || {});
        setLeadMagnets(data.leadMagnets || {});
        setVisualPrompts(data.visualPrompts || []);
        
        const platforms = Object.keys(data.scripts || {});
        if (platforms.length > 0) {
          setActiveTab(platforms[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    generateScript();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePDF = async () => {
    const { jsPDF } = await import('jspdf');
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const bonus = leadMagnets[activeTab] || '';
      const script = scripts[activeTab] || '';
      const title = state.topicTitle || 'Marketing Strategiyasi';
      const niche = state.niche || 'Business';

      // Colors & Styling
      const gold = [201, 168, 76];
      const dark = [10, 10, 10];
      const lightGray = [180, 180, 180];

      const drawHeader = (pageNum: number, pageTitle: string) => {
        doc.setFillColor(dark[0], dark[1], dark[2]);
        doc.rect(0, 0, 210, 297, 'F');
        
        // Gold border accent
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(0.5);
        doc.line(10, 10, 200, 10);
        doc.line(10, 287, 200, 287);

        // Logo text
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('VERBA AI CONTENT ENGINE', 150, 20);
        
        doc.setTextColor(100, 100, 100);
        doc.text(`PAGE ${pageNum}`, 20, 20);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text(pageTitle.toUpperCase(), 20, 35);
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(1);
        doc.line(20, 38, 40, 38);
      };

      // Page 1: Premium Cover
      doc.setFillColor(dark[0], dark[1], dark[2]);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Large Gold Rectangle for title background
      doc.setFillColor(gold[0], gold[1], gold[2]);
      doc.rect(20, 80, 5, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(42);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(title, 150);
      doc.text(titleLines, 35, 100);

      doc.setFontSize(16);
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.text(niche.toUpperCase(), 35, 85);

      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Ekspertlar va kontent-meykerlar uchun maxsus qo\'llanma', 35, 130);

      doc.setFontSize(10);
      doc.text(`Sana: ${new Date().toLocaleDateString()}`, 35, 260);
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.text('www.verba.ai', 35, 265);

      // Page 2: Viral Script
      doc.addPage();
      drawHeader(2, 'Viral Ssenariy');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const scriptLines = doc.splitTextToSize(script, 170);
      doc.text(scriptLines, 20, 55);

      // Page 3: Lead Magnet (Specific promised content)
      if (bonus) {
        doc.addPage();
        drawHeader(3, 'Lead Magnet (Sovg\'a)');
        
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.setFontSize(10);
        doc.text('Ushbu material CTAdagi va\'daga muvofiq tayyorlandi.', 20, 45);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        const bonusLines = doc.splitTextToSize(bonus, 170);
        doc.text(bonusLines, 20, 60);
      }

      doc.save(`Verba_${activeTab}_Prezentatsiya.pdf`);
    } catch (e) {
      console.error('PDF Generation failed:', e);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = () => {
    const text = scripts[activeTab] || '';
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Verba_${activeTab}_Ssenariy_${new Date().getTime()}.txt`;
    element.click();
  };

  const currentScript = scripts[activeTab] || '';
  const currentBonus = leadMagnets[activeTab] || '';

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
       <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black font-sans tracking-tight text-white uppercase tracking-tighter">5. Yakuniy ssenariylar</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-1.5 py-0.5 rounded bg-[#C9A84C]/20 text-[#C9A84C] text-[9px] font-black uppercase tracking-widest border border-[#C9A84C]/30">
              {state.selectedSkill}
            </span>
            <p className="text-gray-500 text-[10px] font-bold tracking-tighter uppercase">{state.niche}</p>
          </div>
      </div>
        
        {!loading && (
          <div className="flex gap-2">
             <button onClick={onBack} className="px-4 py-2 bg-white/5 text-white/50 hover:text-white border border-white/10 rounded-lg text-[10px] font-black transition-all hover:bg-white/10 uppercase tracking-widest">
              ← Orqaga
            </button>
            <button onClick={() => generateScript()} className="p-2.5 bg-[#111] hover:bg-[#222] border border-white/10 rounded-lg transition-all text-[#C9A84C] hover:border-[#C9A84C]/50" title="Qayta yozish">
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button onClick={handleDownload} className="p-2.5 bg-[#111] hover:bg-[#222] border border-white/10 rounded-lg transition-all text-gray-400 hover:text-white" title="Yuklab olish">
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleCopy(currentScript)} 
              className="flex items-center gap-2 px-6 py-2 btn-gold rounded-lg shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="uppercase tracking-widest text-[10px] font-black">{copied ? 'OK' : 'Nusxa'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Platform Tabs */}
          {!loading && Object.keys(scripts).length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {Object.keys(scripts).map(platform => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    activeTab === platform 
                      ? 'bg-[#C9A84C] text-black border-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                      : 'bg-[#111] text-gray-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          )}

          <div className="glass rounded-xl p-6 relative min-h-[500px] border border-white/5">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 h-full absolute inset-0">
                <div className="w-full max-w-sm mx-auto relative mb-6">
                   <div className="flex justify-between items-end mb-2">
                     <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em]">Ssenariylar tayyorlanmoqda...</span>
                     <span className="text-xl font-black text-white">{Math.round(progress)}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                     <motion.div 
                       className="h-full bg-gradient-to-r from-[#C9A84C]/50 to-[#C9A84C] transition-all duration-300"
                       style={{ width: `${progress}%` }}
                     />
                   </div>
                   <div className="mt-4 p-4 rounded-lg bg-[#050505] border border-white/5 flex flex-col gap-1.5 font-mono text-[9px] text-left">
                     {logs.map((log, i) => (
                       <p key={i} className={i === 0 ? 'text-green-500' : 'text-gray-600'}>
                         {'>'} {log}
                       </p>
                     ))}
                   </div>
                </div>
              </div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ssenariy Matni:</span>
                    <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">{activeTab}</span>
                  </div>
                  <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest hover:underline">
                    {isEditing ? 'Saqlash' : 'Tahrirlash'}
                  </button>
                </div>
                {isEditing ? (
                  <textarea
                    value={currentScript}
                    onChange={(e) => {
                      const newScripts = { ...scripts, [activeTab]: e.target.value };
                      setScripts(newScripts);
                    }}
                    className="w-full h-[350px] bg-transparent text-white resize-none outline-none leading-relaxed text-sm font-medium p-2 border border-[#C9A84C]/30 rounded-lg focus:border-[#C9A84C] transition-all"
                  />
                ) : (
                  <div className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed font-semibold text-white/95 whitespace-pre-wrap selection:bg-[#C9A84C] selection:text-black tracking-tight mb-8">
                    {currentScript || 'Ssenariy generatsiya qilinmagan.'}
                  </div>
                )}

                {/* Bonus Material Section */}
                <AnimatePresence>
                  {currentBonus && !loading && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 border-t border-[#C9A84C]/30 pt-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Bonus Material (Lead Magnet)</h4>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={generatePDF}
                            disabled={isGeneratingPDF}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                          >
                            <Download className="w-3 h-3" />
                            {isGeneratingPDF ? 'Tayyorlanmoqda...' : 'PDF Prezentatsiya'}
                          </button>
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/10">
                        <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                          {currentBonus}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* AI Image Prompts */}
          <div className="glass rounded-xl p-5 border border-[#C9A84C]/10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                <Edit3 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">AI Image Prompts</h3>
            </div>
            
            <p className="text-[10px] text-gray-500 italic leading-none">Vizual qism uchun tayyor promptlar:</p>

            <div className="flex flex-col gap-3">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-20 w-full animate-pulse bg-white/5 rounded-lg border border-white/5"></div>
                ))
              ) : (
                visualPrompts.map((prompt, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0a0a0a] border border-white/5 hover:border-[#C9A84C]/30 transition-all group">
                    <p className="text-[11px] text-gray-400 font-mono leading-relaxed line-clamp-4 group-hover:text-white transition-colors">
                      {prompt}
                    </p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(prompt);
                        const btn = document.getElementById(`prompt-btn-${i}`);
                        if (btn) btn.innerText = "OLINDI";
                        setTimeout(() => { if (btn) btn.innerText = "NUSXA"; }, 2000);
                      }}
                      className="mt-2 text-[9px] font-black text-[#C9A84C] uppercase tracking-widest flex items-center gap-1 opacity-50 hover:opacity-100"
                    >
                      <span id={`prompt-btn-${i}`}>NUSXA</span> <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Neural Insight */}
          <div className="glass rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Neural Insight</h3>
            </div>
             <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <p className="text-[11px] text-blue-300 leading-relaxed font-medium italic">
                  Ushbu ssenariy {state.selectedSkill} strukturasi asosida optimallashtirildi. Har bir platforma uchun individual timing va algoritm hisobga olindi.
                </p>
             </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-[#C9A84C]/20 to-transparent border border-[#C9A84C]/10 flex flex-col items-center text-center gap-3">
             <h4 className="text-xs font-black text-white uppercase tracking-widest">30 Kunlik Kontent-Plan</h4>
             <p className="text-[10px] text-gray-500">Ushbu mavzuni 30 kunlik strategiyaga aylantirmoqchimisiz?</p>
             <button className="w-full py-2.5 bg-[#C9A84C] text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#E0C16C] transition-all shadow-lg shadow-[#C9A84C]/20">
               Rejani Generatsiya qilish
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
