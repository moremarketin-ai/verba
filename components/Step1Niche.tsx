'use client';

import { useState } from 'react';
import { 
  Camera, 
  Play, 
  Briefcase, 
  Send, 
  Zap, 
  Layout, 
  Sparkles,
  Stethoscope,
  Home,
  GraduationCap,
  Armchair,
  Utensils,
  Laptop,
  Truck,
  Heart,
  Store,
  Compass,
  Star,
  Settings,
  ChevronRight,
  Plus,
  ArrowLeft,
  Gem,
  Palette,
  Mic2,
  PenTool,
  Cpu,
  UserCheck,
  MessageSquare,
  Scale,
  Banknote,
  Users,
  ShieldCheck,
  BookOpen,
  Plane,
  ShoppingBag,
  Pill,
  Baby
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubNiche {
  id: string;
  name: string;
  icon: any;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  subNiches: SubNiche[];
}

const CATEGORIES: Category[] = [
  { 
    id: 'marketing', 
    name: 'Marketing & Media', 
    icon: Zap, 
    color: 'text-amber-400',
    subNiches: [
      { id: 'smm', name: 'SMM', icon: Camera },
      { id: 'target', name: 'Target & SEO', icon: Layout },
      { id: 'pr', name: 'PR & Branding', icon: Star },
      { id: 'video', name: 'Video Production', icon: Play },
      { id: 'copy', name: 'Kopirayting', icon: PenTool },
      { id: 'influencer', name: 'Influencer & Personal Brand', icon: UserCheck },
    ]
  },
  { 
    id: 'biznes', 
    name: 'Biznes & Moliya', 
    icon: Briefcase, 
    color: 'text-blue-400',
    subNiches: [
      { id: 'consult', name: 'Konsalting', icon: MessageSquare },
      { id: 'legal', name: 'Advokatura', icon: Scale },
      { id: 'finance', name: 'Moliya / Bank', icon: Banknote },
      { id: 'logistics', name: 'Logistika', icon: Truck },
      { id: 'export', name: 'Eksport / Import', icon: Plane },
      { id: 'hr', name: 'HR & Rekruting', icon: Users },
    ]
  },
  { 
    id: 'med', 
    name: 'Tibbiyot & Wellness', 
    icon: Stethoscope, 
    color: 'text-emerald-400',
    subNiches: [
      { id: 'dental', name: 'Stomatologiya', icon: Heart },
      { id: 'clinic', name: 'Xususiy Klinika', icon: Stethoscope },
      { id: 'pharmacy', name: 'Dori-darmon / Apteka', icon: Pill },
      { id: 'psych', name: 'Psixologiya', icon: Sparkles },
      { id: 'fitness', name: 'Fitness & Yoga', icon: Zap },
      { id: 'lab', name: 'Laboratoriya', icon: Heart },
    ]
  },
  { 
    id: 'edu', 
    name: 'Ta\'lim & Karyera', 
    icon: GraduationCap, 
    color: 'text-cyan-400',
    subNiches: [
      { id: 'lang', name: 'Til markazlari', icon: Mic2 },
      { id: 'it_edu', name: 'IT kurslar', icon: Laptop },
      { id: 'kindergarten', name: 'Bog\'cha / Maktab', icon: Baby },
      { id: 'training', name: 'O\'quv markazi', icon: BookOpen },
      { id: 'uni', name: 'Oliy ta\'lim', icon: GraduationCap },
      { id: 'online', name: 'Onlayn kurslar', icon: Play },
    ]
  },
  { 
    id: 'retail', 
    name: 'Savdo & Chakana', 
    icon: Store, 
    color: 'text-orange-400',
    subNiches: [
      { id: 'supermarket', name: 'Oziq-ovqat / Market', icon: ShoppingBag },
      { id: 'cosmetics', name: 'Kosmetika / Parfumeriya', icon: Sparkles },
      { id: 'furniture', name: 'Mebel', icon: Armchair },
      { id: 'auto', name: 'Avtosalon', icon: Settings },
      { id: 'fashion', name: 'Kiyim / Moda', icon: Palette },
      { id: 'electro', name: 'Elektronika', icon: Cpu },
    ]
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle & Hospitality', 
    icon: Utensils, 
    color: 'text-pink-400',
    subNiches: [
      { id: 'resto', name: 'Restoran / Kafe', icon: Utensils },
      { id: 'tourism', name: 'Turizm', icon: Plane },
      { id: 'beauty', name: 'Go\'zallik saloni', icon: Sparkles },
      { id: 'events', name: 'To\'y & Event', icon: Star },
      { id: 'hotel', name: 'Mehmonxona', icon: Home },
      { id: 'interior', name: 'Interyer Dizayn', icon: Palette },
    ]
  },
  { 
    id: 'tech', 
    name: 'Sanoat & Texnologiya', 
    icon: Cpu, 
    color: 'text-slate-400',
    subNiches: [
      { id: 'factory', name: 'Ishlab chiqarish', icon: Settings },
      { id: 'textile', name: 'Tekstil sanoati', icon: Palette },
      { id: 'energy', name: 'Energetika / Quyosh', icon: Zap },
      { id: 'agro', name: 'Agrosanoat / Fermer', icon: Heart },
      { id: 'ai', name: 'AI & Avtomatizatsiya', icon: Cpu },
      { id: 'parts', name: 'Qurilish materiallari', icon: Home },
    ]
  },
  { 
    id: 'real_estate', 
    name: 'Ko\'chmas Mulk', 
    icon: Home, 
    color: 'text-yellow-500',
    subNiches: [
      { id: 'new_build', name: 'Novostroyka', icon: Home },
      { id: 'rent', name: 'Ofis / Ijara', icon: Layout },
      { id: 'realtor', name: 'Rieltorlik xizmati', icon: Users },
      { id: 'interior_design', name: 'Dizayn loyiha', icon: Palette },
      { id: 'land', name: 'Hovli / Er uchastkasi', icon: Home },
      { id: 'build_serv', name: 'Qurilish xizmati', icon: Settings },
    ]
  },
  { 
    id: 'it_digital', 
    name: 'IT & Digital', 
    icon: Laptop, 
    color: 'text-indigo-400',
    subNiches: [
      { id: 'apps', name: 'Mobil ilovalar', icon: Laptop },
      { id: 'web', name: 'Web-saytlar', icon: Layout },
      { id: 'saas', name: 'SaaS / Startup', icon: Zap },
      { id: 'callcenter', name: 'Call-center / Autsors', icon: MessageSquare },
      { id: 'security', name: 'Kiberxavfsizlik', icon: ShieldCheck },
      { id: 'ai_serv', name: 'AI xizmatlar', icon: Sparkles },
    ]
  },
];

interface Step1NicheProps {
  onNext: (niche: string) => void;
}

export default function Step1Niche({ onNext }: Step1NicheProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [customNiche, setCustomNiche] = useState('');

  const handleSubNicheSelect = (name: string) => {
    onNext(name);
  };

  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black font-sans tracking-tight text-white uppercase tracking-tighter">
                1. Yo'nalishni tanlang
              </h2>
              <p className="text-gray-400 text-sm font-medium italic">
                AI strategiyasini qaysi guruh asosida quramiz?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className="glass rounded-[1.5rem] p-6 border border-white/5 hover:border-[#C9A84C]/50 transition-all duration-500 group relative overflow-hidden text-left"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A84C]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#C9A84C]/10 transition-all"></div>
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-1">{cat.name}</h3>
                    <p className="text-gray-500 text-[10px] font-bold italic tracking-wide uppercase">{cat.subNiches.length} ta soha</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[#C9A84C] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                      Tanlash <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="subniches"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <h2 className="text-xl font-black font-sans tracking-tight text-white uppercase tracking-tighter leading-none">
                  {selectedCategory.name}
                </h2>
                <p className="text-gray-400 text-sm font-medium italic mt-1.5">Endi aniq sohangizni bosing:</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {selectedCategory.subNiches.map((sub) => {
                const Icon = sub.icon;
                return (
                  <button 
                    key={sub.id}
                    onClick={() => handleSubNicheSelect(sub.name)}
                    className="glass rounded-xl p-4 border border-white/5 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all duration-300 group flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white uppercase tracking-tighter text-[11px] leading-tight">
                      {sub.name}
                    </span>
                  </button>
                );
              })}

              {/* Custom Input inside SubNiches */}
              <div className="col-span-2 md:col-span-3 lg:col-span-4 mt-6">
                <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                    <Plus className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    placeholder={`Boshqa ${selectedCategory.name} sohasini yozing...`}
                    className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-gray-700 font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customNiche.trim()) {
                        handleSubNicheSelect(customNiche);
                      }
                    }}
                  />
                  <button 
                    onClick={() => customNiche.trim() && handleSubNicheSelect(customNiche)}
                    disabled={!customNiche.trim()}
                    className="bg-[#C9A84C] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E0C16C] transition-all disabled:opacity-50"
                  >
                    Tayyor <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
