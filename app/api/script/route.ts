import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  const body = await request.json();
  const { topicTitle, topicDesc, platforms, platformSettings, hookText, toneOfVoice, selectedSkill, niche, ctaText, leadMagnetUsage, leadMagnetType } = body;
    
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    
    const targetPlatforms: string[] = platforms && platforms.length > 0 ? platforms : ['Instagram'];
    const platformList = targetPlatforms.join(', ');

    // === SKILL-SPECIFIC WRITING FRAMEWORKS ===
    const skillFrameworks: Record<string, string> = {
      'PAS': `
PAS STRUKTURASI (Problem → Agitate → Solution):
1. MUAMLO: Tomoshabin o'zini taniydigon ANIQ muammoni 1-2 keskin gap bilan noma et. Raqam yoki fakt ishlat.
2. KUCHAYTIRISH: Ushbu muammoning og'riqli oqibatlarini his ettir — ular buni hal qilmasalar nima yo'qotadi?
3. YECHIM: O'zingni ekspert sifatida taqdim et. Yechimni oddiy, ammo ta'sirchan tarzda ber. "Men buni ko'rdim / boshdan kechirdim" uslubi.`,

      'AIDA': `
AIDA STRUKTURASI (Attention → Interest → Desire → Action):
1. E'TIBOR: Shunday keskin gap yoz-ki, tomoshabin davom ettirishga majbur bo'lsin. Savol yoki shok statistika.
2. QIZIQISH: Nima berishingni ko'rsatmasdan, faqat qiziqtirib qo'y. "Bu usulni bilganlar..." uslubi.
3. ISTAK: Konkret natija yoki o'zgarish va'da qil. Raqamlar, vaqt, natija — his ettiradigan narsalar.
4. HARAKAT: CTAni tabiiy va qisqa yoz. Buyruq emas, taklif shaklida.`,

      'Storytelling': `
STORYTELLING STRUKTURASI (Klassik hikoya texnikasi):
1. QAHRAMON: "Men" yoki "Bir klientim" bilan boshla. Tomoshabin qahramonni tanishi kerak.
2. ZIDDIYAT: Qarshilikni, to'siqni aniq detallar bilan tasvirla. Bu his ettirilishi shart.
3. O'ZGARISH NUQTASI: Nimadir sodir bo'ldi — bir insayt, usul, tanishish, qaror.
4. NATIJA: Hozirgi holat — konkret, ishonchli, real. Raqam yoki misal bilan mustahkamla.
5. XULOSA: Tomoshabinga "kechagi siz uchun" murojaat qil.`,

      'Challenger': `
CHALLENGER STRUKTURASI (Stereotipni sindirish):
1. OMMAVIY FIKR: "Ko'pchilik shunday o'ylaydi — [noto'g'ri fikr]". Aniq va tanish bo'lsin.
2. SINDIRUV: "Lekin bu noto'g'ri, va men isbotlayman." Shok effekt, qarama-qarshilik.
3. HAQIQAT: O'zingning nuqtai nazaringni dalillar bilan ochib ber. Raqamlar, tadqiqot, shaxsiy kuzatuv.
4. YANGI PARADIGMA: Tomoshabinga yangi ko'rinish ber — ular bu mavzuya boshqacha qarashi kerak.`
    };

    // === TONE OF VOICE ===
    const toneInstructions: Record<string, string> = {
      'Ekspert (Autoritet)': `Qisqa, keskin, ishonchli gaplar. Hech qanday "balki", "ehtimol" yo'q. Raqamlar va faktlar bilan gapir. "Bu ishlaydi" emas, "Bu 83% holatlarda ishlaydi" de.`,
      "Do'stona (Hikoyachi)": `Isiq, samimiy, yaqin do'st kabi. "Sen" ishlat. "Bilasanmi...", "Rostini aytay..." kabi boshlovchilar. Qisqa va tabiiy gaplar.`,
      'Provokatsion (Agressiv)': `Keskin, chaqiriq. "Siz yanglishyapsiz. Va men buni isbotlayman." FOMO va raqobat hissi yarating. Hujum uslubi.`,
      'Analitik (Raqamli)': `Sovuq, mantiqiy, raqamli. Har bir gap dalil bilan. Statistika, tadqiqot, A/B test. Faqat o'lchanishi mumkin bo'lgan narsalar.`
    };

    // === PLATFORM-SPECIFIC RULES ===
    const platformRules = targetPlatforms.map(p => {
      const settings = platformSettings?.[p];
      const duration = settings?.sliderValue || 60;
      const approxWords = Math.round(duration * 2.2);

      if (p === 'YouTube') {
        return `YOUTUBE (${duration}s ~ ${approxWords} so'z): Kuchli 15s intro (YouTube 15s da yo'qotadi). Har 60-90s da "pattern interrupt". "Like basing / Obuna" CTAni o'rtaga ham qo'y. FAQAT SOF MATN — kadr izohlari yo'q.`;
      } else if (p === 'Instagram') {
        return `INSTAGRAM REELS (${duration}s ~ ${approxWords} so'z): Birinchi 3s hayot-mamot — BOSH ILGAK. Ritmik, qisqa gaplar. Teleprompter uslubi — FAQAT SOF MATN, emoji yo'q, kadr yo'q.`;
      } else if (p === 'LinkedIn') {
        return `LINKEDIN POST: Birinchi 2 qator juda kuchli bo'lsin ("...ko'proq o'qi" tugmasidan oldin). Paragraflar qisqa. Emoji deyarli yo'q. Shaxsiy tajriba + professional xulosa.`;
      } else if (p === 'Telegram') {
        return `TELEGRAM POST: Birinchi qator = sarlavha (bold). Emojilar: ✅ 🔸 kabilar. 200-400 so'z. Oxirida savol yoki so'rov bilan tugat.`;
      } else {
        return `${p}: Platforma auditoriyasiga mos professional kontent.`;
      }
    }).join('\n');

    // === LEAD MAGNET ===
    const leadMagnetSection = leadMagnetUsage === 'without'
      ? `STRATEGIYA — LEAD MAGNETSIZ: Barcha sirlar va qiymatni videoning o'zida to'liq ber. Hech narsa yashirilmaydi. Oxirida kuchli xulosa yoz, CTA yo'q.`
      : `STRATEGIYA — LEAD MAGNET (${leadMagnetType?.toUpperCase()}): CTA: "${ctaText}". Lead magnet matni uchun:
${leadMagnetType === 'pdf' ? '5-7 ta aniq, amaliy maslahat yoki checklist. Sarlavha, kichik sarlavhalar, punktlar.' : leadMagnetType === 'article' ? 'Telegram uchun tayyor post: sarlavha, asosiy mazmun, hashteglar.' : 'Linkka o\'tishni tabiiy va qiziqarli tarzda taqdim et.'}`;

    // === FULL PROMPT ===
    const prompt = `
ROL: Sen O'zbekiston bozorining viral kontent strategiyasini mukammal tushunadigan, top copywriter va script yozuvchisan. Gemini eng kuchli versiyasin — sening har bir gaping tomoshabinni harakatga keltirishi kerak.

TOPSHIRIQ:
- Soha: "${niche}"
- Mavzu: "${topicTitle}" (${topicDesc})
- Platformalar: ${platformList}
- Ilgak: "${hookText}"

=====================================
YOZISH OHANGI:
${toneInstructions[toneOfVoice] || toneInstructions['Ekspert (Autoritet)']}

=====================================
YOZISH FRAMEWORK (qat'iy ishlatilsin):
${skillFrameworks[selectedSkill] || skillFrameworks['PAS']}

=====================================
PLATFORMA QOIDALARI (har biri uchun ALOHIDA ssenariy):
${platformRules}

=====================================
${leadMagnetSection}

=====================================
VIRAL YOZISH QOIDALARI (BULAR SHART):
1. Birinchi gap = "SCROLL TO STOP" — tomoshabin o'zini ko'rishi yoki keskin savol.
2. "Curiosity Gap" — sirni anglatib qo'y, ammo keyinchalik ochdirasan.
3. Raqamlar his uyg'otadi: "7 dan 3 tasi", "92% biznes", "18 oyda".
4. Har bir gap keyingisini o'qitishi kerak — "loop" effekti.
5. O'zbek tomoshabin uchun: tanish vaziyat, oddiy so'zlar, mahalliy misollar ishlat.
6. "Siz/sen" bilan to'g'ridan-to'g'RI murojaat — sodiqlik oshadi.
7. Har bir ssenariy TAYYOR holda bo'lsin — bir so'z ham o'zgartirmasdan o'qish mumkin.
8. Takror iboralardan qoching — har bir gap yangi g'oya.

=====================================
OUTPUT FORMAT (FAQAT JSON, boshqa hech narsa yo'q):
{
  "scripts": {
     "PlatformName": "Tayyor ssenariy matni..."
  },
  "leadMagnets": {
     "PlatformName": "Lead magnet matni (checklist/post/ma'lumot)..."
  },
  "visualPrompts": [
    "Kadr 1: [Aniq sahna tavsifi — fon, harakat, ob'ektlar]",
    "Kadr 2: [Aniq sahna tavsifi]"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const result = JSON.parse(response.text || '{}');
    return NextResponse.json({ 
      scripts: result.scripts || {},
      leadMagnets: result.leadMagnets || {},
      visualPrompts: result.visualPrompts || [],
      platforms: targetPlatforms
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
