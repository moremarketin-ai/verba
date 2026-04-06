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
      { id: 'smm', name: 'SMM va Ijtimoiy Tarmoqlar', icon: Camera },
      { id: 'target', name: 'Targeted Advertising', icon: Layout },
      { id: 'seo', name: 'SEO & Google Ads', icon: Compass },
      { id: 'pr', name: 'PR & Jamoatchilik Bilan Aloqa', icon: Star },
      { id: 'branding', name: 'Brending & Korporativ Identitet', icon: Gem },
      { id: 'video', name: 'Video Production & Montaj', icon: Play },
      { id: 'copy', name: 'Kopirayting & Kontent Yozish', icon: PenTool },
      { id: 'influencer', name: 'Influencer Marketing', icon: UserCheck },
      { id: 'personal_brand', name: 'Personal Brending', icon: Star },
      { id: 'email', name: 'Email Marketing', icon: Send },
      { id: 'telegram', name: 'Telegram Marketing & Bot', icon: Send },
      { id: 'analytics', name: 'Marketing Analitikasi', icon: Layout },
      { id: 'design', name: 'Grafik Dizayn', icon: Palette },
      { id: 'podcast', name: 'Podcast & Audio Kontent', icon: Mic2 },
      { id: 'advertising', name: 'Reklama Agentligi', icon: Zap },
      { id: 'affiliate', name: 'Affiliate Marketing', icon: Users },
      { id: 'community', name: 'Hamjamiyat Boshqaruvi', icon: Users },
    ]
  },
  { 
    id: 'biznes', 
    name: 'Biznes & Moliya', 
    icon: Briefcase, 
    color: 'text-blue-400',
    subNiches: [
      { id: 'consult', name: 'Biznes Konsalting', icon: MessageSquare },
      { id: 'legal', name: 'Advokatura & Yuridik Xizmat', icon: Scale },
      { id: 'finance', name: 'Moliyaviy Maslahat', icon: Banknote },
      { id: 'bank', name: 'Bank & Kredit Xizmatlari', icon: Banknote },
      { id: 'accounting', name: "Buxgalteriya & Soliq", icon: Banknote },
      { id: 'insurance', name: "Sug'urta", icon: ShieldCheck },
      { id: 'logistics', name: 'Logistika & Yetkazib Berish', icon: Truck },
      { id: 'export', name: 'Eksport & Import', icon: Plane },
      { id: 'hr', name: 'HR & Rekruting', icon: Users },
      { id: 'franchise', name: 'Franchayzing', icon: Briefcase },
      { id: 'startup', name: 'Startap & Innovatsiyalar', icon: Zap },
      { id: 'invest', name: 'Investitsiya & Fond Bozori', icon: Banknote },
      { id: 'audit', name: 'Audit & Moliyaviy Tekshiruv', icon: ShieldCheck },
      { id: 'ecom_biz', name: 'E-commerce Biznes', icon: ShoppingBag },
      { id: 'trade', name: 'Savdo-sotiq & Distribusiya', icon: Store },
      { id: 'management', name: 'Menejment & Liderlik', icon: UserCheck },
      { id: 'notary', name: 'Notarius & Hujjatlashtirish', icon: BookOpen },
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
      { id: 'pharmacy', name: 'Apteka & Dori-darmon', icon: Pill },
      { id: 'psych', name: 'Psixologiya & Psixoterapiya', icon: Sparkles },
      { id: 'fitness', name: 'Fitnes & Gym', icon: Zap },
      { id: 'yoga', name: 'Yoga & Meditatsiya', icon: Heart },
      { id: 'lab', name: 'Laboratoriya & Diagnostika', icon: Stethoscope },
      { id: 'cosmetology', name: 'Kosmetologiya & Anti-age', icon: Sparkles },
      { id: 'ophthalmology', name: "Ko'z Shifoxonasi", icon: Heart },
      { id: 'pediatrics', name: 'Pediatriya & Bolalar Salomatligi', icon: Baby },
      { id: 'nutrition', name: 'Dietologiya & Ovqatlanish', icon: Utensils },
      { id: 'onco', name: 'Onkologiya Markazi', icon: Stethoscope },
      { id: 'massaj', name: 'Massaj & Reabilitatsiya', icon: Heart },
      { id: 'surgery', name: 'Xirurgiya Klinikasi', icon: Stethoscope },
      { id: 'cardio', name: 'Kardiologiya', icon: Heart },
      { id: 'biohacking', name: 'Biohaking & Longevity', icon: Zap },
      { id: 'telemedicine', name: 'Teletibbiyot', icon: Laptop },
      { id: 'vet', name: 'Veterinariya', icon: Heart },
    ]
  },
  { 
    id: 'edu', 
    name: "Ta'lim & Karyera", 
    icon: GraduationCap, 
    color: 'text-cyan-400',
    subNiches: [
      { id: 'lang', name: "Til O'quv Markazlari", icon: Mic2 },
      { id: 'it_edu', name: 'IT & Dasturlash Kurslari', icon: Laptop },
      { id: 'kindergarten', name: "Bog'cha & Maktabcha", icon: Baby },
      { id: 'school', name: 'Xususiy Maktab', icon: GraduationCap },
      { id: 'training', name: "O'quv Markazi & Repetitor", icon: BookOpen },
      { id: 'uni', name: "Oliy Ta'lim & Kollejlar", icon: GraduationCap },
      { id: 'online', name: 'Onlayn Kurslar & EdTech', icon: Play },
      { id: 'coaching', name: 'Kouching & Self-Development', icon: UserCheck },
      { id: 'mba', name: "MBA & Biznes Ta'lim", icon: Briefcase },
      { id: 'design_edu', name: 'Dizayn Kurslari', icon: Palette },
      { id: 'marketing_edu', name: 'Marketing Kurslari', icon: Zap },
      { id: 'music', name: 'Musiqa Maktabi', icon: Mic2 },
      { id: 'art', name: "San'at & Rasm Maktabi", icon: Palette },
      { id: 'kids_dev', name: 'Bolalar Rivojlantirish', icon: Baby },
      { id: 'sport_edu', name: "Sport Maktabi", icon: Zap },
      { id: 'career', name: 'Karyera Konsalting', icon: Star },
      { id: 'abroad', name: "Chet Elda Ta'lim", icon: Plane },
    ]
  },
  { 
    id: 'retail', 
    name: 'Savdo & Chakana', 
    icon: Store, 
    color: 'text-orange-400',
    subNiches: [
      { id: 'grocery', name: 'Oziq-ovqat & Supermarket', icon: ShoppingBag },
      { id: 'cosmetics', name: 'Kosmetika & Parfumeriya', icon: Sparkles },
      { id: 'furniture', name: 'Mebel & Uy Jihozlari', icon: Armchair },
      { id: 'auto', name: 'Avtosalon & Dilerlik', icon: Settings },
      { id: 'fashion', name: 'Kiyim & Moda', icon: Palette },
      { id: 'electro', name: 'Elektronika & Gadjetlar', icon: Cpu },
      { id: 'kids_toys', name: "Bolalar Tovar & O'yinchoqlar", icon: Baby },
      { id: 'sports', name: 'Sport Tovarlari', icon: Zap },
      { id: 'books', name: 'Kitob & Kantselyariya', icon: BookOpen },
      { id: 'pet', name: 'Zooveterinariya & Pet Mahsulotlar', icon: Heart },
      { id: 'flowers', name: 'Gul & Dekor', icon: Gem },
      { id: 'jewelry', name: 'Zargarlik & Aksessuarlar', icon: Gem },
      { id: 'auto_parts', name: 'Ehtiyot Qismlar & Avto Market', icon: Settings },
      { id: 'building_mat', name: "Qurilish Materiallari Do'koni", icon: Home },
      { id: 'online_shop', name: "Onlayn Do'kon & Instagram Savdo", icon: ShoppingBag },
      { id: 'market', name: 'Ulgurji & Bozor Savdosi', icon: Store },
      { id: 'organic', name: "Organik & Sog'lom Oziqlar", icon: Heart },
    ]
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle & Hospitality', 
    icon: Utensils, 
    color: 'text-pink-400',
    subNiches: [
      { id: 'resto', name: 'Restoran & Kafe', icon: Utensils },
      { id: 'fastfood', name: 'Fastfud & Delivery', icon: Truck },
      { id: 'catering', name: 'Katering & Banket', icon: Utensils },
      { id: 'tourism', name: 'Turizm & Sayohat', icon: Plane },
      { id: 'beauty', name: "Go'zallik Saloni", icon: Sparkles },
      { id: 'barbershop', name: 'Barber Shop', icon: Sparkles },
      { id: 'nail', name: 'Nail Studio & Manikur', icon: Palette },
      { id: 'spa', name: 'SPA & Hammom', icon: Heart },
      { id: 'events', name: "To'y & Event Agentligi", icon: Star },
      { id: 'hotel', name: 'Mehmonxona & Hostel', icon: Home },
      { id: 'interior', name: 'Interyer Dizayn', icon: Palette },
      { id: 'photography', name: 'Fotografiya & Videografiya', icon: Camera },
      { id: 'tattoo', name: 'Tattoo & Body Art', icon: PenTool },
      { id: 'escape', name: "Kvest & O'yin-Kulgi Markazi", icon: Compass },
      { id: 'confectionery', name: 'Qandolat & Tort Ustaxonasi', icon: Star },
      { id: 'blog_lifestyle', name: 'Lifestyle Blog & Vlog', icon: UserCheck },
      { id: 'clubbing', name: 'Nightlife & Club Management', icon: Mic2 },
    ]
  },
  { 
    id: 'tech', 
    name: 'Sanoat & Texnologiya', 
    icon: Cpu, 
    color: 'text-slate-400',
    subNiches: [
      { id: 'factory', name: 'Ishlab Chiqarish Zavodi', icon: Settings },
      { id: 'textile', name: 'Tekstil Sanoati', icon: Palette },
      { id: 'energy', name: 'Energetika & Elektr Tizimlar', icon: Zap },
      { id: 'solar', name: 'Quyosh Panellari', icon: Zap },
      { id: 'agro', name: 'Agrosanoat & Fermerlik', icon: Heart },
      { id: 'food_prod', name: 'Oziq-ovqat Ishlab Chiqarish', icon: Utensils },
      { id: 'ai', name: 'AI & Avtomatizatsiya', icon: Cpu },
      { id: 'robotics', name: 'Robototexnika', icon: Cpu },
      { id: 'construction', name: 'Qurilish & Arxitektura', icon: Home },
      { id: 'water', name: "Suv Ta'minoti & Sanitariya", icon: Home },
      { id: 'printing', name: 'Bosmaval & Poligrafiya', icon: PenTool },
      { id: 'mining', name: 'Qazib Olish Sanoati', icon: Settings },
      { id: 'chemical', name: 'Kimyo Sanoati', icon: Pill },
      { id: 'transport', name: 'Transport & Avtomobilsozlik', icon: Truck },
      { id: 'woodwork', name: "Yog'och Ishlari & Mebel Ishlab Ch.", icon: Settings },
    ]
  },
  { 
    id: 'real_estate', 
    name: "Ko'chmas Mulk", 
    icon: Home, 
    color: 'text-yellow-500',
    subNiches: [
      { id: 'new_build', name: 'Yangi Qurilish & Novostroyka', icon: Home },
      { id: 'secondary', name: 'Ikkilamchi Bozor', icon: Home },
      { id: 'rent', name: 'Ijara & Ofis Maydoni', icon: Layout },
      { id: 'realtor', name: 'Rieltorlik Agentligi', icon: Users },
      { id: 'interior_design', name: 'Interyer Dizayn Loyihasi', icon: Palette },
      { id: 'land', name: 'Hovli & Yer Uchastkasi', icon: Home },
      { id: 'build_serv', name: 'Qurilish Xizmati & Pudrat', icon: Settings },
      { id: 'dacha', name: "Dacha & Bog' Uylari", icon: Home },
      { id: 'commercial', name: "Tijorat Ko'chmas Mulk", icon: Briefcase },
      { id: 'appraisal', name: "Ko'chmas Mulk Baholash", icon: Star },
      { id: 'mortgage', name: 'Ipoteka & Moliyalashtirish', icon: Banknote },
      { id: 'property_mgmt', name: 'Mulkni Boshqarish', icon: ShieldCheck },
    ]
  },
  { 
    id: 'it_digital', 
    name: 'IT & Digital', 
    icon: Laptop, 
    color: 'text-indigo-400',
    subNiches: [
      { id: 'apps', name: 'Mobil Ilovalar Ishlab Chiqish', icon: Laptop },
      { id: 'web', name: 'Web-sayt & Landing Page', icon: Layout },
      { id: 'saas', name: 'SaaS & Dasturiy Mahsulot', icon: Zap },
      { id: 'ecom_tech', name: 'E-commerce Platformalar', icon: ShoppingBag },
      { id: 'callcenter', name: 'Call-center & Outsourcing', icon: MessageSquare },
      { id: 'security', name: 'Kiberxavfsizlik', icon: ShieldCheck },
      { id: 'ai_serv', name: 'AI Xizmatlar & Chatbot', icon: Sparkles },
      { id: 'crm', name: 'CRM & ERP Tizimlar', icon: Settings },
      { id: 'cloud', name: 'Cloud & DevOps', icon: Layout },
      { id: 'ui_ux', name: 'UI/UX Dizayn', icon: Palette },
      { id: 'game_dev', name: "O'yin Ishlab Chiqish", icon: Star },
      { id: 'data', name: "Ma'lumotlar Ilmi & Analitika", icon: Cpu },
      { id: 'blockchain', name: 'Blockchain & Web3', icon: ShieldCheck },
      { id: 'it_support', name: "IT Qo'llab-quvvatlash & Xizmat", icon: Settings },
      { id: 'telegram_dev', name: 'Telegram Bot Ishlab Chiqish', icon: Send },
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
                1. Yo&apos;nalishni tanlang
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
                <p className="text-gray-400 text-sm font-medium italic mt-1.5">Aniq sohangizni tanlang — jami {selectedCategory.subNiches.length} ta soha:</p>
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
