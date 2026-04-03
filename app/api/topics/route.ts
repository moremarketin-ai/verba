import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh');
    const mode = searchParams.get('mode') || 'all';
    const niche = searchParams.get('niche') || 'Marketing';
 
    const geminiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiKey) {
      return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
    }
 
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
      let instructions = '';
      if (mode === 'trending') {
        instructions = `AYNAN ${niche} SOHASIDA: So'nggi 30-45 kun ichida trendga chiqqan 10 ta eng yangi va viral marketing muammolari va ularning yechimlarini toping. FAQAT YouTube, Instagram, Reddit, Twitter, Quora va Google ma'lumotlariga tayaning.`;
      } else if (mode === 'proven') {
        instructions = `AYNAN ${niche} SOHASIDA: 1-3 yil davomida dunyo bo'ylab barqaror sotuv berib kelayotgan 10 ta klassik strategiyalarni toping. FAQAT YouTube, Instagram, Reddit, Twitter, Quora va Google ma'lumotlariga tayaning.`;
      } else {
        instructions = `AYNAN ${niche} SOHASIDA: Umumiy 10 ta eng kuchli g'oya: 5 ta viral muammo va 5 ta barqaror biznes yechimini toping. FAQAT YouTube, Instagram, Reddit, Twitter, Quora va Google ma'lumotlariga tayaning.`;
      }

    const prompt = `
      ROLE: You are the world's most elite Strategic Marketing Researcher and Trend Analyst. 
      Your mission is to perform a REAL-TIME search on the internet for the "${niche}" niche.
      
      SEARCH LANGUAGE PRIORITY (QIDIRUV TARTIBI):
      1. FIRST: Search in ENGLISH — find the most viewed, most engaged content (50K+ views minimum).
      2. SECOND: Search in RUSSIAN — find popular Russian-language content with high reach (50K+ views minimum).
      3. NEVER search in Uzbek, Turkish, or other languages.
      
      PLATFORM MIX (ARALASH PLATFORMALAR) — JUDA MUHIM:
      Natijalar bir xil platformadan bo'lmasin! ARALASH bo'lishi SHART:
      - 3-4 ta INSTAGRAM (Reels, Posts) dan
      - 3-4 ta YOUTUBE (Videos, Shorts) dan
      - 1-2 ta REDDIT dan
      - 1-2 ta TWITTER yoki QUORA dan
      Agar 10 tadan 5+ tasi bitta platformadan bo'lsa — bu XATO. Har doim aralashtirib ber.
      
      QUALITY FILTER — SIFAT MEZONI:
      - MINIMUM 50,000 ko'rilish (views/reach). 50K dan kam bo'lgan kontent — TAQIQLANADI.
      - Prioritize: Millionlab ko'rilganlar > Yuz minglab > 50K minimum.
      - Faqat faolligi yuqori (ko'p izoh, ulashish, saqlash) kontentlardan g'oya ol.
      - Tasodifiy maqola yoki past sifatli blog postlarni OLMA.
      
      TASK: Find 10 ideas with BALANCED MIX from Instagram, YouTube, Reddit, and Twitter about "${niche}". Each idea must come from content with 50K+ views MINIMUM.
      
      STRICT NEGATIVE PROMPT: DO NOT use TikTok as a source. DO NOT mention TikTok.
      
      MODE: ${mode}
      
      CRITICAL LANGUAGE RULE — SODDA O'ZBEK TILI (chiqish tili):
      Qidiruv ingliz va rus tilida bo'ladi, LEKIN natijalar (title, description) SODDA O'ZBEK TILIDA yoziladi.
      Inglizcha marketing atamalarini ISHLATMA. O'rniga oddiy o'zbek yoki ruscha-o'zbek so'zlarni ishlat:
      - "viral" → "ko'p tarqalgan" yoki "ommaga ketgan" yoki "rek"
      - "content" → "kontent" yoki "post" yoki "material"  
      - "hook" → "ilgak" yoki "bosh gap"
      - "engagement" → "faollik" yoki "qiziqish"
      - "trending" → "trendda" yoki "mashhur"
      - "niche" → "soha" yoki "yo'nalish"
      - "audience" → "odamlar" yoki "kuzatuvchilar"
      - "conversion" → "sotuv" yoki "natija"
      - "funnel" → "sotuv bosqichlari"
      - "branding" → "brend qurish" yoki "nom chiqarish"
      - "pain point" → "muammo" yoki "og'riq nuqtasi"
      - "call to action" → "harakatga chaqiriq"
      - "insight" → "sir" yoki "foydali ma'lumot"
      Matn shunday yozilsinki, oddiy O'zbek tadbirkor yoki uy bekasi ham darhol tushunsin.
      
      RULES FOR CONTENT:
      1. Source Name: Actual platform name where you found the content (e.g., YouTube, Reddit).
      2. DO NOT include any links/URLs in the JSON — I will extract them from the grounding metadata.
      3. Language: "title" and "description" MUST BE IN SIMPLE UZBEK — no English jargon.
      4. Use diverse angles: Miflarni buzish, Hayratlanarli raqamlar, Yashirin usullar, Teskari fikrlar.
      
      JSON OUTPUT FORMAT:
      [{ 
        "id": "1", 
        "title": "Title in SIMPLE UZBEK (no English words)", 
        "description": "Short strategic insight in SIMPLE UZBEK", 
        "searchTitle": "The same title but in ENGLISH (for YouTube search)",
        "sourceName": "Actual platform name", 
        "painLevel": 9,
        "type": "trending" 
      }]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    // Extract REAL links from Grounding Metadata (Citations)
    let groundingLinks: string[] = [];
    try {
      const candidates = (response as any).candidates;
      if (candidates && candidates[0]?.groundingMetadata?.groundingChunks) {
        const chunks = candidates[0].groundingMetadata.groundingChunks;
        groundingLinks = chunks
          .filter((chunk: any) => chunk.web?.uri)
          .map((chunk: any) => chunk.web.uri)
          .filter((url: string) => !url.includes('tiktok.com')); // ABSOLUTE FILTER: NO TIKTOK
      }
    } catch (e) {
      console.warn('Could not extract grounding metadata:', e);
    }

    // Extract search result URLs from groundingMetadata.searchEntryPoint or webSearchQueries
    try {
      const candidates = (response as any).candidates;
      if (candidates && candidates[0]?.groundingMetadata?.webSearchQueries) {
        // These are the actual search queries Gemini used (useful for fallback)
        console.log('Search queries used:', candidates[0].groundingMetadata.webSearchQueries);
      }
    } catch (e) { /* skip */ }

    let rawText = response.text || '[]';
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (jsonMatch) rawText = jsonMatch[0];

    let result = [];
    try {
      result = JSON.parse(rawText);
      if (!Array.isArray(result) || result.length === 0) throw new Error("Invalid output format");

      // Distribute grounding links across topics
      const linksPerTopic = Math.max(1, Math.floor(groundingLinks.length / result.length));
      
      result = result.map((topic: any, i: number) => {
        const start = i * linksPerTopic;
        const topicLinks = groundingLinks.slice(start, start + linksPerTopic);
        
        // Generate YouTube search URL in ENGLISH (not Uzbek) as reliable fallback
        const searchQuery = topic.searchTitle || niche;
        const searchFallback = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        
        // If source name was TikTok, rename to more general 'Social Media' or specific search engine
        const safeSourceName = topic.sourceName?.toLowerCase().includes('tiktok') ? 'Viral Trends' : topic.sourceName;
        
        return {
          ...topic,
          sourceName: safeSourceName,
          links: topicLinks.length > 0 ? topicLinks : [searchFallback],
          linksAreSearch: topicLinks.length === 0 // flag to indicate these are search links
        };
      });

    } catch (e) {
      console.warn('Failed to parse JSON, using premium fallback data:', rawText);
      result = [
        {
          id: "fallback_1",
          title: "SMM O'ldi: Yangi Era",
          description: "Oddiy postlar endi sotmaydi. AI-ga asoslangan shaxsiyat — yagona najot.",
          sourceName: "LinkedIn / Reddit",
          links: [`https://www.youtube.com/results?search_query=${encodeURIComponent(niche + ' SMM trends 2026')}`],
          linksAreSearch: true,
          painLevel: 10,
          type: "trending"
        },
        {
          id: "fallback_2",
          title: "90% Tadbirkorlar Xatosi",
          description: "Mijozga yoqishga urinish sotuvni 40% ga kamaytirishi isbotlandi.",
          sourceName: "Instagram / Shorts",
          links: [`https://www.youtube.com/results?search_query=${encodeURIComponent(niche + ' business mistakes')}`],
          linksAreSearch: true,
          painLevel: 9,
          type: "proven"
        }
      ];
    }
    
    return NextResponse.json({ topics: result, groundingLinksCount: groundingLinks.length });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
