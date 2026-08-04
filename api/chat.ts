import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
  }

  try {
    // Ensure req.body is parsed whether sent as JSON object or stringified body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    const { prompt, language = 'fr', persona = 'guide', apiKey: customKey } = body || {};

    console.log('[Vercel Serverless] Incoming /api/chat request:', { persona, promptLength: prompt?.length });

    const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.GEMINI_API;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Missing API Key',
        message: 'GEMINI_API_KEY environment variable is missing on Vercel. Please set GEMINI_API_KEY in Vercel Project Settings -> Environment Variables and redeploy.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Try stable Gemini models in sequence
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let responseText = '';
    let lastError = null;

    const systemInstruction = persona === 'historian' 
      ? 'Tu es un historien expert du patrimoine algérien.'
      : persona === 'culinary'
      ? 'Tu es un chef spécialiste de la gastronomie algérienne.'
      : 'Tu es un guide touristique chaleureux et passionné de l\'Algérie.';

    for (const model of modelsToTry) {
      try {
        const resAi = await ai.models.generateContent({
          model,
          contents: prompt || 'Bonjour, présente-toi brièvement.',
          config: {
            systemInstruction
          }
        });
        if (resAi?.text) {
          responseText = resAi.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Vercel Serverless] Model ${model} failed:`, err?.message);
      }
    }

    if (!responseText) {
      // Automatic backup if Gemini API key is rate limited (429 Quota Exceeded)
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
            provider: 'gemini-backup',
            persona
          });
        }
      } catch (backupErr) {
        console.warn('[Vercel Serverless] Backup AI failed:', backupErr);
      }

      throw lastError || new Error('All Gemini models failed to generate content');
    }

    return res.status(200).json({
      reply: responseText,
      provider: 'gemini',
      persona
    });

  } catch (error: any) {
    console.error('[Vercel Serverless] /api/chat error:', error);
    return res.status(500).json({
      error: 'Gemini API Error',
      message: error?.message || 'An error occurred while generating response.'
    });
  }
}
