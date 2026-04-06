import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  const body = await request.json();
    const { topicTitle, topicDesc, platforms, platformSettings, hookText, toneOfVoice, selectedSkill, niche, selectedCTA, ctaText, leadMagnetUsage, leadMagnetType } = body;
    
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
      // Determine the target platforms
      const targetPlatforms: string[] = platforms && platforms.length > 0 
        ? platforms 
        : ['Instagram'];

      const platformList = targetPlatforms.join(', ');

      const leadMagnetInstructions = leadMagnetUsage === 'without' 
        ? `
          STRATEGIYA: LEAD MAGNETSIZ (TO'G'RIDAN-TO'G'RI QIYMAT).
          BU JUDA MUHIM: Foydalanuvchi hech qanday sovg'a va'da qilmaydi.
          SIZNING VAZIFANGIZ: Videoning o'zida barcha qimmatli ma'lumotlarni (insaytlarni, sirlarni) to'liq ochib bering. 
          Ssenariy oxirida odamlarni profilga o'tishga emas, balki berilgan ma'lumotdan hayratga tushishga undang. 
          Ssenariy oxirida CTA bo'lmaydi, shunchaki kuchli xulosa yozing.
        `
        : `
          STRATEGIYA: LEAD MAGNET BILAN (${leadMagnetType?.toUpperCase()}).
          BU MUHIM: Ssenariy oxirida "${ctaText}" ishlatiladi.
          SIZNING VAZIFANGIZ: "${leadMagnetType}" turiga mos keluvchi mukammal sovg'a/material matnini tayyorlang.
          - PDF bo'lsa: Kichik va foydali qo'llanma (checklist/ekspeedstsiya) matni.
          - POST/MAQOLA bo'lsa: Telegram uchun tayyor maqola matni.
          - LINK/VIDEO bo'lsa: Ssenariyda o'sha manbaga qiziqtiruvchi gaplar bo'lishi kerak.
          Lead Magnet matni alohida "leadMagnets" qismida bo'lsin.
        `;

      const prompt = `
        SIZ — DUNYODAGI ENG QIMMAT KOPIRAYTING AGENTISIZ.
        MAQSAD: "${niche}" sohasi uchun "${topicTitle}" (${topicDesc}) mavzusida GIPNOTIK ssenariy yozing.
        PLATFORMALAR: ${platformList}
        OHANG: ${toneOfVoice}
        ILGAK: "${hookText}"
        STRATEGIYA: ${selectedSkill}
        
        ${leadMagnetInstructions}

        SSENARIY STRUKTURASI:
        1. ILGAK (Hook).
        2. QIYMAT (Value) - ${leadMagnetUsage === 'without' ? 'Maksimal darajada batafsil va yangi ma\'lumotlar' : 'Muammoni ochish va yechimga yo\'l ko\'rsatish'}.
        3. YAKUN - ${leadMagnetUsage === 'without' ? 'Kuchli xulosa' : 'Harakatga chaqiriq (CTA)'}.

        OUTPUT FORMAT (JSON ONLY):
        {
          "scripts": {
             "PlatformName": "Script content..."
          },
          "leadMagnets": {
             "PlatformName": "Matnli maqola yoki PDF uchun checklist matni..."
          },
          "visualPrompts": []
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
