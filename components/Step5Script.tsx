'use client';

import { useState, useEffect } from 'react';
import { AppState } from '@/app/page';
import { Copy, Download, RefreshCcw, Edit3, Check, Sparkles, Target, ExternalLink, User, ArrowLeft, RefreshCw, Plus, AlertCircle } from 'lucide-react';
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
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);

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

  const generateForPlatform = async (platform: string) => {
    setLoadingPlatform(platform);
    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state, platforms: [platform] })
      });

      if (res.ok) {
        const data = await res.json();
        setScripts(prev => ({ ...prev, ...(data.scripts || {}) }));
        setLeadMagnets(prev => ({ ...prev, ...(data.leadMagnets || {}) }));
        // Using existing visual prompts is usually fine, or we can append
        
        setActiveTab(platform);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingPlatform(null);
  };

  useEffect(() => {
    generateScript();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper: write paginated text, returns final Y position
  const writePaginatedText = (
    doc: any,
    lines: string[],
    startY: number,
    x: number,
    maxY: number,
    lineH: number,
    addNewPage: () => void
  ) => {
    let y = startY;
    for (const line of lines) {
      if (y + lineH > maxY) {
        addNewPage();
        y = 55;
      }
      doc.text(line, x, y);
      y += lineH;
    }
  };

  const openWithGamma = () => {
    const script = scripts[activeTab] || '';
    const bonus = leadMagnets[activeTab] || '';
    const author = authorName ? `\n\nMuallif: ${authorName}${authorTitle ? ' — ' + authorTitle : ''}` : '';
    const fullContent = `MAVZU: ${state.topicTitle}\nSOHA: ${state.niche}\nPLATFORMA: ${activeTab}\n\n== SSENARIY ==\n${script}\n\n== BONUS MATERIAL ==\n${bonus}${author}`;
    navigator.clipboard.writeText(fullContent).then(() => {
      window.open('https://gamma.app/create', '_blank');
    });
  };

  const generatePDF = async () => {
    setShowAuthorModal(false);
    const { jsPDF } = await import('jspdf');
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const bonus = leadMagnets[activeTab] || '';
      const script = scripts[activeTab] || '';
      const title = state.topicTitle || 'Marketing Strategiyasi';
      const niche = state.niche || '';
      const author = authorName || '';
      const aTitle = authorTitle || '';

      // Color palette
      const gold = [201, 168, 76] as [number,number,number];
      const dark = [10, 10, 10] as [number,number,number];
      const cardBg = [22, 22, 22] as [number,number,number];
      const gray = [130, 130, 130] as [number,number,number];

      const LINE_H = 6.5;
      const CONTENT_X = 25;
      const CONTENT_W = 160;
      const PAGE_BOTTOM = 278;

      // ===== PAGE 1: COVER =====
      doc.setFillColor(...dark);
      doc.rect(0, 0, 210, 297, 'F');

      // Right accent panel
      doc.setFillColor(18, 18, 18);
      doc.rect(145, 0, 65, 297, 'F');
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.4);
      doc.line(145, 0, 145, 297);

      // Niche tag
      if (niche) {
        doc.setFillColor(...gold);
        doc.rect(20, 65, niche.length * 2.5 + 10, 8, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(niche.toUpperCase(), 25, 70.5);
      }

      // Main title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(title, 115);
      doc.text(titleLines, 20, 88);

      // Subtitle divider
      const titleEndY = 88 + titleLines.length * 11;
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.6);
      doc.line(20, titleEndY + 4, 60, titleEndY + 4);

      // Platform badge
      const platText = (state.platforms || []).join(' · ') || activeTab;
      doc.setTextColor(...gray);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(platText, 20, titleEndY + 14);

      // Author block at bottom
      if (author) {
        doc.setFillColor(28, 28, 28);
        doc.rect(20, 240, 120, 22, 'F');
        doc.setDrawColor(...gold);
        doc.setLineWidth(0.3);
        doc.rect(20, 240, 120, 22, 'S');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(author, 27, 250);

        if (aTitle) {
          doc.setTextColor(...gray);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          doc.text(aTitle, 27, 257);
        }
      }

      // Date bottom right
      doc.setTextColor(...gray);
      doc.setFontSize(8);
      doc.text(new Date().toLocaleDateString('uz-UZ'), 20, 282);

      // ===== PAGE 2: SCRIPT =====
      doc.addPage();
      doc.setFillColor(...dark);
      doc.rect(0, 0, 210, 297, 'F');

      // Header
      doc.setFillColor(...gold);
      doc.rect(0, 0, 210, 12, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(activeTab.toUpperCase() + ' — SSENARIY', 20, 8);
      if (author) doc.text(author, 150, 8);

      // Section label
      doc.setTextColor(...gold);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('VIRAL SSENARIY', CONTENT_X, 28);
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.6);
      doc.line(CONTENT_X, 31, 75, 31);

      // Script text with smart pagination
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const scriptLines = doc.splitTextToSize(script, CONTENT_W);
      let pageCount = 2;

      let y = 42;
      for (const line of scriptLines) {
        if (y + LINE_H > PAGE_BOTTOM) {
          // New page
          doc.addPage();
          pageCount++;
          doc.setFillColor(...dark);
          doc.rect(0, 0, 210, 297, 'F');
          doc.setFillColor(...gold);
          doc.rect(0, 0, 210, 12, 'F');
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text(activeTab.toUpperCase() + ' — SSENARIY (DAVOMI)', 20, 8);
          if (author) doc.text(author, 150, 8);
          doc.setTextColor(230, 230, 230);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          y = 25;
        }
        doc.text(line, CONTENT_X, y);
        y += LINE_H;
      }

      // ===== PAGE 3+: BONUS MATERIAL =====
      if (bonus) {
        doc.addPage();
        pageCount++;
        doc.setFillColor(...dark);
        doc.rect(0, 0, 210, 297, 'F');

        // Header
        doc.setFillColor(...gold);
        doc.rect(0, 0, 210, 12, 'F');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('BONUS MATERIAL — LEAD MAGNET', 20, 8);
        if (author) doc.text(author, 150, 8);

        // Section label
        doc.setTextColor(...gold);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('BONUS MATERIAL', CONTENT_X, 28);
        doc.setDrawColor(...gold);
        doc.setLineWidth(0.6);
        doc.line(CONTENT_X, 31, 80, 31);

        doc.setTextColor(230, 230, 230);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const bonusLines = doc.splitTextToSize(bonus, CONTENT_W);

        let by = 42;
        for (const line of bonusLines) {
          if (by + LINE_H > PAGE_BOTTOM) {
            doc.addPage();
            doc.setFillColor(...dark);
            doc.rect(0, 0, 210, 297, 'F');
            doc.setFillColor(...gold);
            doc.rect(0, 0, 210, 12, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('BONUS MATERIAL (DAVOMI)', 20, 8);
            if (author) doc.text(author, 150, 8);
            doc.setTextColor(230, 230, 230);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            by = 25;
          }
          doc.text(line, CONTENT_X, by);
          by += LINE_H;
        }
      }

      const safeName = author ? author.replace(/\s+/g, '_') : (niche || 'material');
      doc.save(`${safeName}_${activeTab}_${title.substring(0, 20).replace(/\s+/g, '_')}.pdf`);
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

  const ALL_PLATFORMS = ['Instagram', 'YouTube', 'LinkedIn', 'Telegram', 'Twitter', 'Facebook'];
  const currentPlatforms = Object.keys(scripts);
  const availablePlatforms = ALL_PLATFORMS.filter(p => !currentPlatforms.includes(p));

  return (
    <>
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
      
      {/* Standard Top Navigation */}
      <div className="flex w-full justify-between items-center mb-2 pb-4 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white text-[11px] font-black uppercase tracking-widest border border-white/5">
          <ArrowLeft className="w-4 h-4" /> Ortga qaytish
        </button>
        <button 
          onClick={() => {
            setScripts({});
            setLeadMagnets({});
            setVisualPrompts([]);
            generateScript();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111] hover:bg-[#222] border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 hover:border-[#C9A84C]/40 group text-white"
        >
          <RefreshCw className={`w-4 h-4 text-[#C9A84C] ${loading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} /> 
          Yangilash
        </button>
      </div>

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
                  {state.leadMagnetUsage === 'with' && !loading && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 border-t border-[#C9A84C]/30 pt-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                            {state.leadMagnetType === 'pdf' ? <Download className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                          </div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-widest">
                            {state.leadMagnetType === 'pdf' ? 'Lead Magnet (PDF)' : 
                             state.leadMagnetType === 'article' ? 'Bonus Maqola / Post' : 
                             state.leadMagnetType === 'video_link' ? 'Video Manba' : 'Bonus Material'}
                          </h4>
                        </div>
                        <div className="flex gap-2">
                          {state.leadMagnetType === 'pdf' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setShowAuthorModal(true)}
                                disabled={isGeneratingPDF || !currentBonus}
                                className="flex items-center gap-2 px-4 py-1.5 bg-[#C9A84C] hover:bg-[#E0C16C] text-black border border-[#C9A84C]/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                              >
                                <Download className="w-3 h-3" />
                                {isGeneratingPDF ? 'Tayyorlanmoqda...' : 'PDF yuklab olish'}
                              </button>
                              <button 
                                onClick={openWithGamma}
                                disabled={!currentBonus}
                                className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Gamma bilan ochish
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => currentBonus && handleCopy(currentBonus)}
                              disabled={!currentBonus}
                              className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                            >
                              <Copy className="w-3 h-3" />
                              Nusxa Olish
                            </button>
                          )}
                          
                          {(state.leadMagnetType === 'video_link' || state.leadMagnetType === 'site_link') && (
                            <button 
                              onClick={() => {
                                const urlMatch = currentBonus?.match(/https?:\/\/[^\s]+/);
                                if (urlMatch) window.open(urlMatch[0], '_blank');
                                else alert('Link topilmadi. Matndan nusxa oling.');
                              }}
                              disabled={!currentBonus}
                              className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                            >
                              <Target className="w-3 h-3" />
                              Linkka O'tish
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-5 rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/10 min-h-[100px] flex items-center justify-center">
                        {currentBonus ? (
                          <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap w-full">
                            {currentBonus}
                          </p>
                        ) : loading ? (
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <RefreshCcw className="w-5 h-5 animate-spin" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Bonus material tayyorlanmoqda...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-rose-500/50">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-center">
                              AI bu platforma uchun bonus yaratishda xatolikka yo'l qo'ydi.<br/>
                              Ssenariy matnini o'zidan foydalanishingiz mumkin.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Boshqa platformalarni taklif qilish (Yangi funksional) */}
          {!loading && availablePlatforms.length > 0 && (
            <div className="glass rounded-xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden mt-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-bl-[100px] blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                  Boshqa tarmoqqa ham joylaymizmi?
                </h4>
                <p className="text-[11px] text-gray-500 font-medium">Bitta bosish orqali shu g‘oyani boshqa platformalarga ham moslashtirib oling.</p>
              </div>
              <div className="flex gap-2 flex-wrap relative z-10 mt-2">
                {availablePlatforms.map(p => (
                  <button
                    key={p}
                    onClick={() => generateForPlatform(p)}
                    disabled={loadingPlatform !== null}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#111] hover:bg-[#222] border border-white/10 hover:border-[#C9A84C]/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 text-gray-300"
                  >
                    {loadingPlatform === p ? <RefreshCcw className="w-3 h-3 animate-spin text-[#C9A84C]" /> : <Plus className="w-3 h-3" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

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

    {/* Author Modal */}
    <AnimatePresence>
      {showAuthorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthorModal(false); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0d0d0d] border border-[#C9A84C]/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center">
                <User className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Muallif Ma&apos;lumoti</h3>
                <p className="text-[11px] text-gray-500">PDF-da siz tomonidan tayyorlangan bo&apos;lsin</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest block mb-2">Ism va Familiya</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Masalan: Abdullayev Jasur"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A84C]/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Mutaxassislik yoki Lavozim <span className="text-gray-600">(ixtiyoriy)</span></label>
                <input
                  type="text"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  placeholder="Masalan: Marketing Strategist"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A84C]/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAuthorModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={generatePDF}
                className="flex-1 py-3 rounded-xl bg-[#C9A84C] text-black text-sm font-black hover:bg-[#E0C16C] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDFni Yaratish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
