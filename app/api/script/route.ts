import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  const body = await request.json();
  const { topicTitle, topicDesc, platform, platforms, platformSettings, contentType, sliderValue, hookText, toneOfVoice, selectedSkill, niche, selectedCTA, ctaText } = body;
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    
    // Skill-based structural rules
    let skillRules = '';
    if (selectedSkill === 'PAS') {
      skillRules = "PAS STRUKTURASI: 1. Muammo (Og'riqni ochiq ko'rsatish), 2. Kuchaytirish (Muammoning oqibatlarini qo'rqinchli darajada bo'rttirish), 3. Yechim (Yolg'iz yechim sifatida xizmatingizni taqdim etish).";
    } else if (selectedSkill === 'AIDA') {
      skillRules = "AIDA STRUKTURASI: 1. E'tibor (Ilgak orqali), 2. Qiziqish (Qiziq fakt yoki sir), 3. Xohish (Mijozda xohish uyg'otish), 4. Harakat (Kuchli harakatga chaqiriq).";
    } else if (selectedSkill === 'Challenger') {
      skillRules = "TESKARI FIKR STRUKTURASI: Sohadagi umumiy ishonchga (mifga) qarshi chiqing. Ekspertlarning yolg'onini fosh qiling. Odamlarni shokga tushiradigan 'haqiqat'ni ayting.";
    } else if (selectedSkill === 'Storytelling') {
      skillRules = "HIKOYA STRUKTURASI: Qahramon (mijoz) -> Muammo -> Kurash -> Yechim (Siz). Shaxsiy va hissiy hikoya orqali bog'laning.";
    }

    // Determine the target platforms
    const targetPlatforms: string[] = platforms && platforms.length > 0 
      ? platforms 
      : platform ? [platform] : ['Instagram'];

    const platformList = targetPlatforms.join(', ');

    const platformSpecificInstructions = targetPlatforms.map(p => {
      const s = platformSettings?.[p]?.sliderValue || sliderValue || 60;
      let detail = '';
      if (p === 'YouTube') detail = 'Chuqur, batafsil, ta\'limiy. Long-form. Ko\'proq ma\'lumot va misollar.';
      else if (p === 'Instagram') detail = 'Qisqa, emotsional, vizual. Reels formati. Tez va dinamik.';
      else if (p === 'LinkedIn') detail = 'Professional, rasmiy, biznes tili. Case study va ekspert fikrlari.';
      else if (p === 'Telegram') detail = 'Do\'stona, shaxsiy, uzun post. Oddiy til, gap ohangi.';
      else if (p === 'Twitter') detail = 'Ultra-qisqa, o\'tkir, provokatsion. 280 belgi chegarasi.';
      else if (p === 'Facebook') detail = 'O\'rtacha uzunlik, hikoyali, oilaviy va emotsional.';

      return `${p} uchun ssenariy: Davomiylik/hajm ~${s} soniya/birlik. ${detail}`;
    }).join('\n');

    const prompt = `
      SIZ — DUNYODAGI ENG QIMMAT KOPIRAYTING AGENTISIZ. SIZNING MATNLARINGIZ MILLIONLAB DOLLARLIK SOTUVLARNI GENERATSIYA QILADI.
      
      MAQSAD: "${niche}" sohasi uchun "${topicTitle}" (${topicDesc}) mavzusida GIPNOTIK ssenariy yozing.
      PLATFORMALAR: ${platformList}
      OHANG: ${toneOfVoice}
      ILGAK: "${hookText}" (Kutilmagan boshlanish - Shundan boshlang!)
      STRATEGIYA: ${selectedSkill}
      
      STRICT RULE: DO NOT use TikTok. Focus on: ${platformList}.
      
      CRITICAL LANGUAGE RULE — SODDA O'ZBEK TILI:
      Inglizcha marketing atamalarini ISHLATMA. Oddiy o'zbek yoki ruscha-o'zbek so'zlarni ishlat.
      Matn shunday yozilsinki, oddiy O'zbek tadbirkor yoki uy bekasi ham darhol tushunsin. HECH QANDAY inglizcha marketing atamalari bo'lmasin!
      
      ${skillRules}

      SSENARIY YOZISH QOIDALARI:
      1. MANTIQIY ZANJIR: Jumlalar orasida uzilish bo'lmasin. 
      2. ILMIY FAKT: Har bir ssenariy ichiga "${niche}" sohasiga oid bitta ANIQ ILMIY FAKT kiriting.
      3. HISSIY KO'PRIK: Ilgakdan keyin darhol mijozning ichki muammosiga tegib o'ting.
      4. FORMATLASH: 
         - VIDEOLAR uchun (YouTube, Instagram Reels): FAQAT SOF MATN. Emojilar TAQIQLANADI. Teleprompter rejimi.
         - MATNLI POSTLAR uchun (LinkedIn, Telegram, Facebook, Twitter): Emojilar, chiroyli abzaslar majburiy.
      
      STRUKTURA:
      1. ILGAK (Berilgan ilgakdan boshlang).
      2. KO'PRIK.
      3. SIR.
      4. YECHIM.
      5. HARAKATGA CHAQIRIQ.

      PLATFORMA BO'YICHA MAXSUS TALABLAR:
      ${platformSpecificInstructions}

      HARAKATGA CHAQIRIQ (CTA): "${ctaText}" (Ssenariy aynan shu gap bilan tugashi SHART!)
      
      6. LEAD MAGNET (GIFT) RULE:
         Ssenariy oxiridagi CTA-da va'da qilingan materialning (sovg'a/qo'llanma/checklist) TO'LIQ mazmunini alohida "leadMagnets" qismida yozishingiz SHART. 
         - Bu material foydalanuvchiga haqiqatan ham foyda keltirishi kerak.
         - Agar CTA-da birorta kalit so'z (masalan: "START") bo'lsa, material aynan shu so'z bilan bog'liq bo'lishi kerak.

      TIL: Sodda o'zbek tili. Jonli, qisqa jumlalar. Inglizcha atamalar mutlaqo TAQIQLANADI.

      OUTPUT FORMAT (JSON ONLY):
      Siz har bir tanlangan platforma uchun alohida ob'ekt qaytarishingiz kerak.
      {
        "scripts": {
           "PlatformName": "Script content..."
        },
        "leadMagnets": {
           "PlatformName": "Full content of the promised gift/guide/checklist..."
        },
        "visualPrompts": [
          "Prompt 1 for Midjourney/DALL-E in ENGLISH",
          "Prompt 2 for Midjourney/DALL-E in ENGLISH"
        ]
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
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
