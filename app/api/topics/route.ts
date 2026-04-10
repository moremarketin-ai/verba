import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';


async function fetchYouTubeVideos(query: string, apiKey: string) {
  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (!searchData.items || searchData.items.length === 0) return [];
    
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`;
    const statsRes = await fetch(statsUrl);
    const statsData = await statsRes.json();
    
    return statsData.items.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      views: parseInt(item.statistics.viewCount),
      url: `https://www.youtube.com/watch?v=${item.id}`
    })).filter((v: any) => v.views >= 50000);
  } catch (e) {
    console.error('YouTube API Error:', e);
    return [];
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'all';
    const niche = searchParams.get('niche') || 'Marketing';
    const refreshSeed = searchParams.get('refresh') || '';
 
    const geminiKey = process.env.GEMINI_API_KEY;
    const youtubeKey = process.env.YOUTUBE_API_KEY;
    
    if (!geminiKey) {
      return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
    }
 
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey, apiVersion: 'v1beta' });
      
      // 1. Fetch real YouTube data as context
      let ytContext = "";
      if (youtubeKey) {
        const [enVideos, ruVideos] = await Promise.all([
          fetchYouTubeVideos(`${niche} trends 2024 2025`, youtubeKey),
          fetchYouTubeVideos(`${niche} тренды 2024 2025`, youtubeKey)
        ]);
        
        const allVideos = [...enVideos, ...ruVideos].sort((a, b) => b.views - a.views).slice(0, 8);
        if (allVideos.length > 0) {
          ytContext = "REAL YOUTUBE DATA (50K+ VIEWS):\n" + allVideos.map(v => 
            `- [${v.views.toLocaleString()} views] ${v.title}: ${v.description.substring(0, 100)}... URL: ${v.url}`
          ).join('\n');
        }
      }

      const prompt = `
        ROLE: Sen dunyoning eng yaxshi viral kontent tadqiqotchisi va trend analistisan.
        Asosiy maqsad: Butun internet orqali (Instagram, YouTube, Reddit, Quora va barcha tarmoqlardan) "${niche}" sohasi bo'yicha HAQIQATDA odamlarni qiziqtirgan (viral) muammolar va savollarni topib, ularni kontent g'oyasiga aylantirish.
        
        ${ytContext ? `
        HERE IS DATA FROM YOUTUBE (VERIFIED 50K+ VIEWS):
        ${ytContext}
        Use these as a primary source for YouTube ideas.
        ` : ""}

        SEARCH LANGUAGE PRIORITY (QIDIRUV TARTIBI):
        1. FIRST: Search in ENGLISH — find the most viewed, most engaged content (50K+ views minimum).
        2. SECOND: Search in RUSSIAN — find popular Russian-language content with high reach (50K+ views minimum).
        3. NEVER search in Uzbek, Turkish, or other languages.
        
        PLATFORM MIX (ARALASH PLATFORMALAR) — JUDA MUHIM:
        Istalgan sifatli platformadan (Instagram, YouTube, Reddit, Quora, Twitter, TikTok) ma'lumot izlashga ruxsat etiladi. Asosiysi — g'oya kuchli va viral bo'lsin.
        
        JUDA QAT'IY QOIDA — MANBANI TILLGA OLMA:
        Natija (title va description) yozayotganda HECH QACHON "Redditda aytishlaricha", "Quorada ko'p so'rashadi", "Instagramda mashhur" kabi iboralarni ishlatma!
        Faqat va faqat asosiy MA'NO va G'OYANING o'zini taqdim et. Tomoshabin uchun bu shunchaki kuchli g'oya sifatida ko'rinishi kerak, qayerdan olingani matnda yozilmasligi shart.

        QUALITY FILTER — SIFAT MEZONI:
        - Faqat faolligi yuqori bo'lgan (ko'p javob yozilgan, ko'p ko'rilgan) tortishuvli, qiziqarli muammolar va trendlardan foydalan.
        
        MODE VA MIQDOR: 
        Agar MODE 'all' bo'lsa: ANIQ 10 TA MAVZU BER (5 ta Trending, 5 ta Evergreen).
        Agar MODE 'trending' yoki 'evergreen' bo'lsa: SHU TURI BO'YICHA ANIQ 10 TA MAVZU BER.
        Jami natijalar soni doimo 10 ta bo'lishi SHART. Hozirgi rejim: ${mode}
        
        ${refreshSeed ? `BUNGA E'TIBOR QILING: Bu yangilash so'rovi (Refresh UID: ${refreshSeed}). Oldingi standart g'oyalardan qoching va mutlaqo YANGI, KUTILMAGAN, NOODATIY viral g'oyalarni toping.` : ""}
        
        CRITICAL LANGUAGE RULE — SODDA O'ZBEK TILI (chiqish tili):
        Natijalar (title, description) SODDA O'ZBEK TILIDA yoziladi.
        Inglizcha marketing atamalarini ISHLATMA. O'rniga oddiy o'zbek yoki ruscha-o'zbek so'zlarni ishlat:
        - "viral" → "rek" yoki "ommaga ketgan"
        - "content" → "kontent" yoki "material"  
        - "hook" → "ilgak" yoki "ilmoq"
        - "engagement" → "faollik"
        - "trending" → "trendda"
        
        JSON OUTPUT FORMAT:
        [{ 
          "id": "1", 
          "title": "Title in SIMPLE UZBEK", 
          "description": "Short strategic insight in SIMPLE UZBEK", 
          "searchTitle": "The same title but in ENGLISH (for YouTube search)",
          "sourceName": "Actual platform name", 
          "painLevel": 9,
          "type": "trending",
          "views": "50K+" // If from YouTube, put actual view count if known
        }]
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
              temperature: 0.9,
              tools: [{ googleSearch: {} }]
          }
      });

      let groundingLinks: string[] = [];
      try {
        const candidates = (response as any).candidates;
        if (candidates && candidates[0]?.groundingMetadata?.groundingChunks) {
          const chunks = candidates[0].groundingMetadata.groundingChunks;
          groundingLinks = chunks
            .filter((chunk: any) => chunk.web?.uri)
            .map((chunk: any) => chunk.web.uri)
            .filter((url: string) => !url.includes('tiktok.com'));
        }
      } catch (e) { }

      let rawText = response.text || '[]';
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) rawText = jsonMatch[0];

      let result = [];
      try {
        result = JSON.parse(rawText);
        if (!Array.isArray(result) || result.length === 0) throw new Error("Invalid output format");

        const linksPerTopic = Math.max(1, Math.floor(groundingLinks.length / result.length));
        
        result = result.map((topic: any, i: number) => {
          const start = i * linksPerTopic;
          const topicLinks = groundingLinks.slice(start, start + linksPerTopic);
          
          let finalLinks = topicLinks;
          // If it's a YouTube topic, try to find the actual link from our YT API context if Gemini didn't provide one
          if (topic.sourceName?.toLowerCase() === 'youtube' && topicLinks.length === 0) {
            const searchQuery = topic.searchTitle || niche;
            finalLinks = [`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`];
          }

          return {
            ...topic,
            links: finalLinks.length > 0 ? finalLinks : [`https://www.google.com/search?q=${encodeURIComponent(topic.searchTitle || niche)}`],
            linksAreSearch: finalLinks.length === 1 && finalLinks[0].includes('search_query=')
          };
        });

      } catch (e) {
        result = [
          {
            id: "err_1",
            title: "Tizimda xatolik",
            description: "Qayta urinib ko'ring yoki boshqa sohani tanlang.",
            sourceName: "System",
            links: ["#"],
            linksAreSearch: true,
            painLevel: 5,
            type: "trending"
          }
        ];
      }
      
      return NextResponse.json({ topics: result, groundingLinksCount: groundingLinks.length });

    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
