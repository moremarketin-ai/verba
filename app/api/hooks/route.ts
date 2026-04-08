import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  const body = await request.json();
  const { topicTitle, topicDesc, platform, platforms, contentType, hookFormat, refreshCount, toneOfVoice, niche } = body;
  const targetPlatforms = platforms && platforms.length > 0 ? platforms : platform ? [platform] : ['Instagram'];
  const platformList = targetPlatforms.join(', ');
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
  }
 
  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey, apiVersion: 'v1' });
    
    const prompt = `
      Your task is to generate 3 powerful opening lines for ${platformList} ${contentType} about "${topicTitle}" (${topicDesc}) in the "${niche}" niche.
      
      STRICT RULE: DO NOT use TikTok-specific slang or references. Focus on: ${platformList}.
      
      TONE: ${toneOfVoice}
      ARCHETYPE/FORMAT: ${hookFormat}

      CRITICAL LANGUAGE RULE — SODDA O'ZBEK TILI:
      Inglizcha marketing atamalarini ISHLATMA. Oddiy o'zbek yoki ruscha-o'zbek so'zlarni ishlat:
      - "viral" → "ko'p tarqalgan" yoki "ommaga ketgan" yoki "rek"
      - "content" → "kontent" yoki "post"
      - "hook" → "ilgak" yoki "bosh gap"
      - "engagement" → "faollik"
      - "trending" → "trendda" yoki "mashhur"
      - "audience" → "odamlar" yoki "kuzatuvchilar"
      - "conversion" → "sotuv" yoki "natija"
      - "pain point" → "muammo"
      - "call to action" → "harakatga chaqiriq"
      - "insight" → "sir" yoki "foydali ma'lumot"
      Matn shunday yozilsinki, oddiy O'zbek tadbirkor ham tushunsin. Hech qanday inglizcha so'z bo'lmasin.

      RULES:
      1. THE FIRST 3 WORDS are patterns-interrupts (kutilmagan so'zlar bilan boshlang).
      2. Hech qachon manbani aytmang (Masalan: "Redditda o'qidim", "Quorada yozishibdi", "Tarmoqlarda mashhur" kabi so'zlarni UMUMAN ISHLATMANG). G'oyani to'g'ridan-to'g'ri, go'yo o'zingizning insaytingizdek ayting.
      3. Language: "text", "triggerLabel", and "explanation" MUST be in SIMPLE UZBEK — no English words.
      4. DO NOT mention TikTok, Reddit, Quora, or Instagram in the text.
      5. "triggerLabel" ham o'zbekcha bo'lsin: "Qo'rquv", "Xato", "Qiziqish", "Sirlilik", "Shoshilinchlik" kabi.
      6. Tomoshabinning o'ziga qaratilgan "Siz" yoki "Sen" olmoshlaridan faol foydalaning.
      
      OUTPUT FORMAT (JSON ARRAY of 3 items):
      [{ 
        "id": "1", 
        "text": "Ilgak matni sodda O'ZBEKCHA", 
        "score": 95, 
        "triggerLabel": "Qo'rquv / Xato / Qiziqish (O'ZBEKCHA)",
        "explanation": "Nima uchun ishlashi haqida qisqacha izoh O'ZBEKCHA" 
      }]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });

    const result = JSON.parse(response.text || '[]');
    return NextResponse.json({ hooks: Array.isArray(result) ? result : result.hooks || result });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
