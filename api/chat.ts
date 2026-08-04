import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Always set CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse request body safely (handles stringified or parsed body)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { prompt = '', language = 'fr', persona = 'guide', apiKey: customKey } = body || {};

    const systemInstruction = persona === 'historian' 
      ? 'Tu es un historien expert du patrimoine algérien.'
      : persona === 'culinary'
      ? 'Tu es un chef spécialiste de la gastronomie algérienne.'
      : 'Tu es un guide touristique chaleureux et passionné de l\'Algérie.';

    const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.GEMINI_API;

    // 1. If Gemini API key is available, attempt Gemini AI model calls
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

        for (const model of modelsToTry) {
          try {
            const resAi = await ai.models.generateContent({
              model,
              contents: prompt || 'Bonjour, présente-toi brièvement.',
              config: { systemInstruction }
            });
            if (resAi?.text) {
              return res.status(200).json({
                reply: resAi.text,
                provider: 'gemini',
                model,
                persona
              });
            }
          } catch (modelErr: any) {
            console.warn(`[Vercel Serverless] Gemini model ${model} skipped:`, modelErr?.message || modelErr);
          }
        }
      } catch (genAiInitErr) {
        console.warn('[Vercel Serverless] Gemini initialization warning:', genAiInitErr);
      }
    }

    // 2. Backup AI Engine (Pollinations AI) if Gemini API key is missing or rate limited (429)
    try {
      const pollRes = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt || 'Bonjour, présente-toi brièvement.' }
          ],
          model: 'openai'
        })
      });
      const pollText = await pollRes.text();
      if (pollText && pollText.trim()) {
        return res.status(200).json({
          reply: pollText.trim(),
          provider: 'ai-backup',
          persona
        });
      }
    } catch (backupErr) {
      console.warn('[Vercel Serverless] Backup AI engine offline:', backupErr);
    }

    // 3. Smart local guide fallback response so function NEVER crashes or fails
    const localFallback = `Bienvenue en Algérie ! De la Casbah d'Alger aux plages d'Oran, du Djurdjura à la magie de Tadrart Rouge à Djanet, l'Algérie offre des paysages époustouflants et une culture millénaire. N'hésitez pas à poser une question spécifique sur les transports, la cuisine ou les sites touristiques !`;

    return res.status(200).json({
      reply: localFallback,
      provider: 'local-fallback',
      persona
    });

  } catch (criticalError: any) {
    console.error('[Vercel Serverless] Critical handler error:', criticalError);
    // Never crash the function - return clean 200 JSON
    return res.status(200).json({
      reply: "Désolé, une erreur temporaire s'est produite. L'Algérie regorge de trésors à découvrir !",
      provider: 'error-fallback',
      error: criticalError?.message || 'Unknown error'
    });
  }
}

