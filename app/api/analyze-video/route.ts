import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  const body = await request.json();
  const { videoUrl, topicTitle } = body;
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: "Gemini Key missing" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    
    const prompt = `
      ROLE: You are a World-Class Viral Content Strategist and Video Architect.
      
      TASK: Directly analyze the following video URL: "${videoUrl}".
      CONTEXT: This video is about "${topicTitle}".
      
      MISSION: Perform a "Deep Forensic Analysis" of this video using your search grounding tool. Focus on YouTube and Instagram (Reels) metrics and audience behavior. DO NOT use TikTok benchmarks.
      
      EXTRACT THE FOLLOWING (IN UZBEK):
      1. Success Secret (Muvaffaqiyat siri): Why did this video go viral? (Psychology, timing, editing style).
      2. Hook Analysis (Ilgak tahlili): What exactly was the opening line/hook? Why did it work?
      3. Script Structure (Ssenariy strukturasi): Break down the logic (e.g., Problem -> Agitation -> Solution).
      
      RULES:
      - Use professional marketing Uzbek (Jonli va professional).
      - If you cannot access the specific transcript, use all available search metadata to provide the most accurate strategic "Reverse Engineering".
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "successSecret": "...",
        "hookAnalysis": "...",
        "structureAnalysis": "...",
        "viralScore": 95
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
        }
    });

    const result = JSON.parse(response.text || '{}');
    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
