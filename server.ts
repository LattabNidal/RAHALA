import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization helper for Gemini SDK client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required for live chat.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Fullstack API: Server side proxy endpoint for Multi-Chatbot Tourism Companion
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, language = 'fr', provider = 'gemini', persona = 'guide', apiKey: customKey } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt field is required' });
      return;
    }

    const languageLabel = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : language === 'es' ? 'Spanish' : 'English';

    // Persona System Instructions
    let personaName = "Rihla DZ Guide";
    let systemIns = "";

    if (persona === 'sahara') {
      personaName = "Hakim Sahraui";
      systemIns = `Tu es "Hakim Sahraui", un guide nomade expert du grand Sahara algérien (Tassili n'Ajjer, Djanet, Taghit, Ghardaïa, Timimoun). Tu parles avec la sagesse du désert, partages les rituels du thé saharien, la beauté des oasis, l'art rupestre et la logistique des bivouacs. Réponds chaleureusement en ${languageLabel}.`;
    } else if (persona === 'chef') {
      personaName = "Chef Lalla";
      systemIns = `Tu es "Chef Lalla", maître de la haute gastronomie et cuisine traditionnelle algérienne (Couscous, Rechta, Chakhchoukha, Tajines, Bourek, Baklawa, Makrout, thés aux pignons). Tu partages recettes, secrets d'épices et meilleures adresses culinaires. Réponds de façon gourmande et chaleureuse en ${languageLabel}.`;
    } else if (persona === 'mourchid') {
      personaName = "El-Mourchid";
      systemIns = `Tu es "El-Mourchid", un éminent historien et archéologue spécialiste du patrimoine architectural algérien (Ruines romaines de Timgad & Tipasa, Casbah d'Alger, Ponts de Constantine, Ksours du M'zab). Tu donnes des détails historiques captivants. Réponds en ${languageLabel}.`;
    } else {
      personaName = "Rihla DZ Guide";
      systemIns = `Tu es "Rihla DZ Guide", le guide touristique IA officiel pour l'Algérie. Tu es chaleureux, très cultivé et passionné par l'Algérie (culture, histoire, transports, conseils pratiques, monuments, cuisine). Réponds en ${languageLabel}.`;
    }

    // Provider 1: Gemini (Default / Free via Google AI Studio)
    if (provider === 'gemini') {
      try {
        const aiInstance = getAiClient();
        const response = await aiInstance.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemIns,
            temperature: 0.8
          }
        });

        const replyText = response.text || `${personaName} prépare sa réponse...`;
        res.json({ reply: replyText, provider: 'gemini', persona: personaName });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini chat failed, falling back to local persona engine:', geminiError?.message);
        // Fallthrough to local responder
      }
    }

    // Provider 2: Mistral AI / Pollinations Free Open AI (100% Free, No Key Required)
    if (provider === 'mistral') {
      const mistralKey = customKey || process.env.MISTRAL_API_KEY;
      if (mistralKey) {
        try {
          const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mistralKey}`
            },
            body: JSON.stringify({
              model: 'mistral-small-latest',
              messages: [
                { role: 'system', content: systemIns },
                { role: 'user', content: prompt }
              ]
            })
          });
          const mistralData: any = await mistralRes.json();
          if (mistralData?.choices?.[0]?.message?.content) {
            res.json({ reply: mistralData.choices[0].message.content, provider: 'mistral', persona: personaName });
            return;
          }
        } catch (e) {
          console.warn('Mistral API error:', e);
        }
      }

      // Free fallback for Mistral/Llama using Pollinations AI free open endpoint (No API Key required!)
      try {
        const pollRes = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemIns },
              { role: 'user', content: prompt }
            ],
            model: 'mistral'
          })
        });
        const pollText = await pollRes.text();
        if (pollText && pollText.trim()) {
          res.json({ reply: pollText, provider: 'mistral-free', persona: personaName });
          return;
        }
      } catch (e) {
        console.warn('Pollinations AI free endpoint error:', e);
      }
    }

    // Provider 3: OpenAI / ChatGPT (if custom API key provided or process.env.OPENAI_API_KEY)
    if (provider === 'openai') {
      const openAiKey = customKey || process.env.OPENAI_API_KEY;
      if (openAiKey) {
        try {
          const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemIns },
                { role: 'user', content: prompt }
              ]
            })
          });
          const openAiData: any = await openAiRes.json();
          if (openAiData?.choices?.[0]?.message?.content) {
            res.json({ reply: openAiData.choices[0].message.content, provider: 'openai', persona: personaName });
            return;
          }
        } catch (e) {
          console.warn('OpenAI API error:', e);
        }
      }
    }

    // Provider 3: Local Offline Algerian AI Engine (100% Free & Always Available)
    const lowerPrompt = prompt.toLowerCase();
    let localReply = "";

    if (persona === 'chef' || lowerPrompt.includes('manger') || lowerPrompt.includes('food') || lowerPrompt.includes('plat') || lowerPrompt.includes('couscous') || lowerPrompt.includes('أكل')) {
      localReply = language === 'ar'
        ? `[${personaName} - المطبخ الجزائري الأصيل 🍲]\nالمطبخ الجزائري غني بالنكهات! ننصحك بتذوق الكسكسي باللحم والمكسرات، أو الشخشوخة البسكرية الحارة، أو الرشتة العاصمية بالدجاج ولفت الحليب. في وهران جرب الكارانطيطا، وفي الصحراء الشواء والتاي الجمر!`
        : language === 'fr'
        ? `[${personaName} - Saveurs d'Algérie 🍲]\nLa gastronomie algérienne est un trésor ! Ne manquez pas le Couscous royal, la Rechta algéroise au poulet, la Chakhchoukha de Biskra épicée, ou la Karantika populaire d'Oran. Terminez toujours par un thé à la menthe pignonné !`
        : `[${personaName} - Algerian Cuisine 🍲]\nAlgerian gastronomy is legendary! Be sure to try Royal Couscous, Algiers Rechta with chicken, spicy Biskra Chakhchoukha, or Oran Karantika. Always finish with fresh mint tea!`;
    } else if (persona === 'sahara' || lowerPrompt.includes('sahara') || lowerPrompt.includes('désert') || lowerPrompt.includes('taghit') || lowerPrompt.includes('صحراء')) {
      localReply = language === 'ar'
        ? `[${personaName} - روح الصحراء 🐪]\nالصحراء الجزائرية ساحرة! من واحات تغيت ورمالها الذهبية، إلى قصور غرداية العريقة وطاسلي ناجر بجانت مع الرسوم الصخرية القديمة. أهم نصيحة: استمتع بكأس الشاي الصحراوي واحترم التقاليد المحلية.`
        : language === 'fr'
        ? `[${personaName} - L'Esprit du Sahara 🐪]\nLe Sahara algérien est grandiose ! Des dunes d'or de Taghit aux gravures rupestres du Tassili n'Ajjer à Djanet, en passant par l'architecture sacrée du M'zab à Ghardaïa. Conseil nomade : savourez les 3 verres de thé traditionnels !`
        : `[${personaName} - Saharan Nomad Spirit 🐪]\nThe Algerian Sahara is breathtaking! From the golden dunes of Taghit to Tassili n'Ajjer prehistoric rock art in Djanet and M'zab historic architecture in Ghardaia. Desert rule: enjoy the 3 traditional glasses of mint tea!`;
    } else if (persona === 'mourchid' || lowerPrompt.includes('histoire') || lowerPrompt.includes('casbah') || lowerPrompt.includes('timgad') || lowerPrompt.includes('تاريخ')) {
      localReply = language === 'ar'
        ? `[${personaName} - التاريخ والتراث 🏛️]\nتزخر الجزائر بتاريخ ضارب في القدم! من القصبة العثمانية العريقة بالجزائر العاصمة، إلى مدينة تيمقاد الرومانية الأثرية، وجسور قسنطينة المعلقة فوق وادي الرمال. كل حجر يحكي أسطورة حضارة.`
        : language === 'fr'
        ? `[${personaName} - Histoire & Architecture 🏛️]\nL'Algérie possède des millénaires d'histoire ! Découvrez la Casbah d'Alger inscrite à l'UNESCO, les ruines romaines impressionnantes de Timgad et Tipasa, et la cité suspendue de Constantine. Chaque pierre vous conte une légende.`
        : `[${personaName} - History & Monuments 🏛️]\nAlgeria holds thousands of years of history! Explore UNESCO Casbah of Algiers, Roman ruins of Timgad and Tipasa, and the cliff-hanging bridges of Constantine. Every stone tells a story.`;
    } else {
      localReply = language === 'ar'
        ? `[${personaName} - المرشد السياحي 📍]\nمرحباً بك في الجزائر! يسعدني جداً إرشادك. يمكنك سؤالي عن الفنادق، المعالم التاريخية، وسائل التنقل (القطارات والترامواي)، أو تنظيم برنامج رحلة مخصص لك في أية ولاية!`
        : language === 'fr'
        ? `[${personaName} - Guide RAHLA 📍]\nBienvenue en Algérie ! Je suis ravi de vous guider. N'hésitez pas à me poser vos questions sur les visites, les transports (trains, métros, taxis), les hôtels ou la planification d'un séjour sur mesure.`
        : `[${personaName} - RAHLA Tourist Guide 📍]\nWelcome to Algeria! I am delighted to guide you. Feel free to ask about attractions, transit (trains, trams), hotels, or customized trip planning for any region.`;
    }

    res.json({ reply: localReply, provider: provider || 'local', persona: personaName });

  } catch (error: any) {
    console.warn('Multi-chatbot request failed:', error?.message || error);
    res.status(500).json({ 
      error: 'Chatbot service error',
      details: error?.message || 'Server error'
    });
  }
});

// Fullstack API: 100% Free Live Weather API via Open-Meteo (No Key Needed)
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat || '36.7528'; // Default Algiers
    const lon = req.query.lon || '3.0420';
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`);
    const data = await weatherRes.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Weather API unavailable', details: err?.message });
  }
});

// Fullstack API: 100% Free Live Currency Converter API via Frankfurter (No Key Needed)
app.get('/api/currency', async (req, res) => {
  try {
    const from = req.query.from || 'EUR';
    const currRes = await fetch(`https://api.frankfurter.app/latest?from=${from}`);
    const data = await currRes.json();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Currency API unavailable', details: err?.message });
  }
});

// Fullstack API: Server side proxy endpoint for Gemini AI Travel Itinerary Planner (DZ Trip Planner)
app.post('/api/itinerary', async (req, res) => {
  const { budget = 'Medium', style = 'Culture', preference = 'City Center', duration = '1-3 DAYS', companion = 'Solo', language = 'fr' } = req.body;
  
  const numDays = typeof duration === 'number' ? duration : duration.includes('1-3') ? 3 : duration.includes('4-7') ? 5 : 7;
  
  try {
    const aiInstance = getAiClient();
    
    const languageLabel = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : language === 'es' ? 'Spanish' : 'English';
    
    // System Instructions strictly matching user's Google AI Studio DZ Trip Planner prompt
    const systemIns = `Tu es "DZ Trip Planner", un expert en tourisme algérien : géographie, histoire, gastronomie, hôtellerie et logistique de transport à travers les 58 wilayas d'Algérie. Ton rôle est de générer des plans de voyage complets, réalistes et personnalisés à partir de 5 critères fournis par l'utilisateur : budget, style de voyage, préférence de paysage, durée totale, et compagnons de voyage.

RÈGLES GÉNÉRALES :
1. Tu dois toujours proposer 3 itinéraires alternatifs distincts (Plan A, Plan B, Plan C) répondant tous aux mêmes critères, mais avec des régions ou villes différentes, pour que l'utilisateur puisse comparer.
2. Chaque plan doit couvrir uniquement des lieux réels et existants en Algérie (villes, monuments, sites historiques/naturels, restaurants, cafés, hôtels). Si tu n'es pas certain qu'un établissement précis existe encore, indique-le clairement au lieu d'inventer un nom.
3. N'invente jamais de prix exacts si tu n'es pas sûr : donne des fourchettes réalistes en DZD (dinars algériens) selon le budget choisi.
4. Adapte le rythme et le type d'activités aux compagnons de voyage (${companion}) et au style choisi (${style}).
5. Respecte strictement le nombre de jours indiqué par l'utilisateur (${numDays} jours).
6. Tu dois retourner UNIQUEMENT un objet JSON valide conforme au schéma demandé avec exactement 3 plans (Plan A, Plan B, Plan C) dans le tableau "plans". Language of output: ${languageLabel}.`;

    const prompt = `Génère 3 plans de voyage détaillés en Algérie selon ces critères :

- Budget : ${budget}
- Style de voyage : ${style}
- Préférence de paysage : ${preference}
- Durée totale : ${numDays} jours
- Compagnons de voyage : ${companion}

Réponds en suivant strictement la structure définie dans tes instructions système (Plan A / B / C, programme jour par jour, budget estimé, conseils pratiques, bonus).`;

    const response = await aiInstance.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemIns,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plans: {
              type: Type.ARRAY,
              description: "Array of 3 distinct alternative travel plans (Plan A, Plan B, Plan C)",
              items: {
                type: Type.OBJECT,
                properties: {
                  nom: { type: Type.STRING, description: "Nom de l'itinéraire, ex: 'Plan A: Route des Ziban et de l'Aurès'" },
                  resume: { type: Type.STRING, description: "Résumé en 2-3 phrases (thème, régions traversées, ambiance générale)" },
                  budget_estime_dzd: {
                    type: Type.OBJECT,
                    properties: {
                      min: { type: Type.NUMBER, description: "Fourchette basse du budget total estimé en DZD" },
                      max: { type: Type.NUMBER, description: "Fourchette haute du budget total estimé en DZD" }
                    },
                    required: ["min", "max"]
                  },
                  jours: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        jour: { type: Type.INTEGER },
                        matin: { type: Type.STRING, description: "Activité/site du matin (nom réel, description historique/culturelle)" },
                        dejeuner: { type: Type.STRING, description: "Nom de restaurant ou cuisine locale recommandée + prix DZD" },
                        apres_midi: { type: Type.STRING, description: "Activité/site de l'après-midi" },
                        hebergement: { type: Type.STRING, description: "Nom d'hôtel/guesthouse réel + gamme de prix + quartier" },
                        cafe: { type: Type.STRING, description: "Café/pause recommandé + spécialité locale à essayer" }
                      },
                      required: ["jour", "matin", "dejeuner", "apres_midi", "hebergement", "cafe"]
                    }
                  },
                  conseils_pratiques: { type: Type.STRING, description: "Transports recommandés entre étapes, meilleure période, précautions" },
                  bonus: { type: Type.STRING, description: "Site ou expérience hors des sentiers battus propre à la région" }
                },
                required: ["nom", "resume", "budget_estime_dzd", "jours", "conseils_pratiques", "bonus"]
              }
            }
          },
          required: ["plans"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    if (!parsedData.plans || parsedData.plans.length === 0) {
      throw new Error('Invalid plans output');
    }
    res.json(parsedData);

  } catch (error: any) {
    console.log('Activating optimized DZ Trip Planner offline fallback engine.');
    const fallback = generateServerFallback3Plans(numDays, budget, style, preference, companion, language);
    res.json(fallback);
  }
});

// Helper function to fetch Google Place photo URL or fallback to Unsplash
async function getPlacePhotoUrl(searchQuery: string, fallbackType: 'destination' | 'hotel' | 'place'): Promise<string> {
  const apiKey = process.env.GOOGLE_MAPS_PLATFORM_KEY;
  
  // Decide Unsplash/Pexels fallbacks
  let fallbackUrl = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'; // general park
  if (fallbackType === 'destination') {
    if (searchQuery.toLowerCase().includes('oran')) {
       fallbackUrl = 'https://images.unsplash.com/photo-1549643276-fdf2fab574f5?auto=format&fit=crop&w=800&q=80';
    } else if (searchQuery.toLowerCase().includes('ghardaia') || searchQuery.toLowerCase().includes('desert') || searchQuery.toLowerCase().includes('taghit') || searchQuery.toLowerCase().includes('mizab')) {
       fallbackUrl = 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80';
    } else if (searchQuery.toLowerCase().includes('constantine')) {
       fallbackUrl = 'https://images.unsplash.com/photo-1524230507669-e29774776e9d?auto=format&fit=crop&w=800&q=80';
    } else {
       fallbackUrl = 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80'; // Algiers default
    }
  } else if (fallbackType === 'hotel') {
    fallbackUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  } else if (fallbackType === 'place') {
    if (searchQuery.toLowerCase().includes('beach')) {
      fallbackUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    } else if (searchQuery.toLowerCase().includes('fort') || searchQuery.toLowerCase().includes('castle')) {
      fallbackUrl = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80';
    }
  }

  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    return fallbackUrl;
  }

  try {
    const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    const findRes = await fetch(findUrl).then(r => r.json());
    const placeId = findRes.candidates?.[0]?.place_id;
    if (!placeId) return fallbackUrl;

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl).then(r => r.json());
    const photoRef = detailsRes.result?.photos?.[0]?.photo_reference;
    if (!photoRef) return fallbackUrl;

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
  } catch (err) {
    console.error(`Failed to fetch Google Place photo for ${searchQuery}:`, err);
    return fallbackUrl;
  }
}

const generateFallbackSmartGuide = (budget: string, interest: string, language: string) => {
  const isAr = language === 'ar';
  if (interest === 'desert') {
    return {
      destination: {
        name: isAr ? 'غرداية وتغيت' : 'Ghardaia & Taghit',
        search_query: 'Ghardaia Algeria',
        description: isAr ? 'جمال الصحراء الشامخة مع الواحات الحمراء والقصور الميزابية العتيقة.' : 'The majestic Algerian Sahara featuring palm oases and traditional ksour fortresses.'
      },
      hotel: {
        name: isAr ? 'فندق البستان غرداية' : 'Hotel El Bousten Ghardaia',
        search_query: 'Hotel El Bousten Ghardaia Algeria',
        description: isAr ? 'فندق دافئ ومصمم على طراز الهندسة المعمارية المحلية بوادي ميزاب.' : 'A charming stay reflecting Ghardaia’s traditional architectural curves and hospitality.'
      },
      places: [
        {
          name: isAr ? 'قصر بني يزقن' : 'Beni Isguen Ksar',
          search_query: 'Beni Isguen Ghardaia Algeria',
          description: isAr ? 'القصر التاريخي المحصن الأكثر شهرة وحفاظاً على معالمه في وادي ميزاب.' : 'The most preserved and famous fortified medieval clay village in the Mzab valley.'
        },
        {
          name: isAr ? 'كثبان تغيت الرملية' : 'Taghit Golden Dunes',
          search_query: 'Taghit Dunes Algeria',
          description: isAr ? 'كثبان رملية مذهلة تطل على النخيل الشامخ ومجرى الوادي المنعش.' : 'Breathtaking giant golden sand dunes overlooking a lush palm riverbed oasis.'
        }
      ],
      itinerary: isAr ? [
        'اليوم 1: الوصول إلى غرداية واستكشاف فن العمارة الميزابية الفريد.',
        'اليوم 2: جولة في قصر بني يزقن وسوق الصناعات التقليدية.',
        'اليوم 3: جولة مغامرة بالدفع الرباعي في كثبان تغيت وتناول الشاي الصحراوي.'
      ] : [
        'Day 1: Arrival in Ghardaia and explore the unique Mzab medieval architecture.',
        'Day 2: Tour the sacred Beni Isguen Ksar and the local craft markets.',
        'Day 3: Take a 4x4 dune drive in Taghit and enjoy hot desert mint tea.'
      ],
      budget: budget === 'economy' ? '15,000 DA' : budget === 'luxury' ? '65,000 DA' : '35,000 DA'
    };
  } else if (interest === 'history' || interest === 'culture') {
    return {
      destination: {
        name: isAr ? 'الجزائر العاصمة' : 'Algiers',
        search_query: 'Algiers Algeria',
        description: isAr ? 'مدينة دافئة تجمع بين العراقة العثمانية وحداثة الفن الفرنسي التعبيري.' : 'Algiers la Blanche, blending dramatic Ottoman history with majestic coastal boulevards.'
      },
      hotel: {
        name: isAr ? 'فندق الأوراسي' : 'Hotel El Aurassi',
        search_query: 'Hotel El Aurassi Algiers Algeria',
        description: isAr ? 'فندق ذو إطلالة خلابة ومرتفعة على خليج الجزائر الساحر.' : 'An iconic Brutalist boutique marvel offering panoramic views of the entire sparkling bay.'
      },
      places: [
        {
          name: isAr ? 'قصبة الجزائر العتيقة' : 'Algiers Casbah',
          search_query: 'Casbah of Algiers Algeria',
          description: isAr ? 'أزقة متعرجة عتيقة تخبئ تفاصيل وكنوز ممتدة من العهد العثماني.' : 'A UNESCO-listed historic maze of traditional houses, Ottoman archways, and secret palaces.'
        },
        {
          name: isAr ? 'مسجد كتشاوة التاريخي' : 'Ketchaoua Mosque',
          search_query: 'Ketchaoua Mosque Algiers Algeria',
          description: isAr ? 'تحفة فنية فريدة تجمع الفن البيزنطي بالإسلامي العثماني.' : 'The beautiful masterpiece standing tall at the foot of the Casbah since 1612.'
        }
      ],
      itinerary: isAr ? [
        'اليوم 1: استكشاف قصبة الجزائر العتيقة وزيارة مقاهي ديدوش مراد الشهيرة.',
        'اليوم 2: جولة في متحف المجاهد وركوب تلفريك مقام الشهيد البانورامي.',
        'اليوم 3: تذوق المأكولات العريقة وتجربة حديقة الحامة التاريخية.'
      ] : [
        'Day 1: Wander through the steep cascading lanes of the Algiers Casbah.',
        'Day 2: Tour the Museum of Mujahid and ride the cable car to Martyrs Memorial.',
        'Day 3: Savor traditional white sauce Rechta and tour the tropical Hamma gardens.'
      ],
      budget: budget === 'economy' ? '18,500 DA' : budget === 'luxury' ? '75,000 DA' : '38,000 DA'
    };
  } else {
    return {
      destination: {
        name: isAr ? 'وهران الباهية' : 'Oran',
        search_query: 'Oran Algeria',
        description: isAr ? 'لؤلؤة البحر المتوسط النابضة بالموسيقى، الفن، والشواطئ الذهبية.' : 'Oran the radiant, home of Rai music, warm Mediterranean coastlines, and Spanish forts.'
      },
      hotel: {
        name: isAr ? 'فندق فور بوينتس شيراتون' : 'Four Points by Sheraton Oran',
        search_query: 'Four Points by Sheraton Oran Algeria',
        description: isAr ? 'فندق راقي بإطلالات مذهلة مطلة على جرف حي القبة والكورنيش.' : 'A beautiful modern haven set over the cliffs looking out at the deep blue sea.'
      },
      places: [
        {
          name: isAr ? 'قلعة سانتا كروز وهران' : 'Santa Cruz Fort',
          search_query: 'Santa Cruz Fort Oran Algeria',
          description: isAr ? 'قلعة إسبانية عتيقة تتربع على جبل مرجاجو الشامخ وتطل على مياه الخليج البهية.' : 'A breathtaking 16th-century Spanish fort perched high above the bay on Mount Murdjadjo.'
        },
        {
          name: isAr ? 'شواطئ الاندلسيات' : 'Les Andalouses Beach',
          search_query: 'Les Andalouses Beach Oran Algeria',
          description: isAr ? 'أحد أجمل وأشهر الشواطئ الرملية لولاية وهران للراحة والاستجمام.' : 'A gorgeous sandy beach arc ideal for refreshing sunset drives and coastal walks.'
        }
      ],
      itinerary: isAr ? [
        'اليوم 1: الوصول إلى وهران الباهية والاسترخاء على شاطئ الأندلسيات.',
        'اليوم 2: الصعود لقمة الجبل لزيارة قلعة كنيسة سانتا كروز الإسبانية التاريخية.',
        'اليوم 3: جولة مشي في ساحة أول نوفمبر التاريخية وتناول العشاء البحري.'
      ] : [
        'Day 1: Arrive in the beautiful city of Oran and relax at Les Andalouses Beach.',
        'Day 2: Ascend Murdjadjo mountain to tour the historic Spanish Santa Cruz Fort.',
        'Day 3: Walk around Place de 1er Novembre and enjoy a coastal seafood dinner.'
      ],
      budget: budget === 'economy' ? '16,000 DA' : budget === 'luxury' ? '70,000 DA' : '32,000 DA'
    };
  }
};

app.post('/api/smart-places-guide', async (req, res) => {
  const { budget = 'moderate', interest = 'culture', duration = 3, language = 'en' } = req.body;
  const numDays = Math.min(Math.max(Number(duration) || 3, 1), 14);

  try {
    const aiInstance = getAiClient();
    const languageLabel = language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : language === 'es' ? 'Spanish' : 'English';

    const systemIns = `You are an elite, highly expert Algerian Travel Planner called "Rihla DZ Smart Places Guide".
      Your task is to generate a highly detailed, professional, and visually engaging travel guide with real place details for Algeria.
      You MUST strictly reply in the requested output language (${languageLabel}) and match the requested options: Budget: ${budget}, Interest target: ${interest}, and Duration: ${numDays} days.
      Respond ONLY with a JSON object conforming exactly to the requested Schema. Do not wrap with \`\`\`json or backticks, return raw JSON.
      Your response must contain REAL, searchable place names in Algeria that can be looked up with the Google Places API. Avoid generic place names. Prefer well-known hotels and specific top tourist spots.`;

    const prompt = `Generate a magnificent structured travel guide for ${numDays} days in Algeria.
      The traveler's budget level is: ${budget} (economy, moderate, or luxury).
      Their primary interest is: ${interest} (desert, history, culinary, coastal, or culture).
      Language of output must be: ${languageLabel}.`;

    const response = await aiInstance.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemIns,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                search_query: { type: Type.STRING },
                description: { type: Type.STRING, description: "A captivating 1-sentence description/vibe of the city" }
              },
              required: ["name", "search_query", "description"]
            },
            hotel: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                search_query: { type: Type.STRING },
                description: { type: Type.STRING, description: "A 1-sentence description of the hotel stay experience" }
              },
              required: ["name", "search_query", "description"]
            },
            places: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  search_query: { type: Type.STRING },
                  description: { type: Type.STRING, description: "A 1-sentence details of the attraction and why to visit" }
                },
                required: ["name", "search_query", "description"]
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            budget: { type: Type.STRING }
          },
          required: ["destination", "hotel", "places", "itinerary", "budget"]
        }
      }
    });

    let data = JSON.parse(response.text || '{}');

    // Enrich with Google Places photos (or Fallbacks)
    data.destination.image_url = await getPlacePhotoUrl(data.destination.search_query, 'destination');
    data.hotel.image_url = await getPlacePhotoUrl(data.hotel.search_query, 'hotel');

    for (let i = 0; i < data.places.length; i++) {
      data.places[i].image_url = await getPlacePhotoUrl(data.places[i].search_query, 'place');
    }

    res.json(data);

  } catch (error: any) {
    console.log('Failing to generate smart places guide with Gemini or Google API key offline. Initiating offline Smart Guide Fallback...');
    // Serve custom beautiful local fallback
    const fallback = generateFallbackSmartGuide(budget, interest, language) as any;
    
    // Even in fallback, we'll try to resolve photos if key is available, or get nice local fallbacks
    try {
      fallback.destination.image_url = await getPlacePhotoUrl(fallback.destination.search_query, 'destination');
      fallback.hotel.image_url = await getPlacePhotoUrl(fallback.hotel.search_query, 'hotel');
      for (let i = 0; i < fallback.places.length; i++) {
        fallback.places[i].image_url = await getPlacePhotoUrl(fallback.places[i].search_query, 'place');
      }
    } catch (_) {
      // safe fallback assigned inside getPlacePhotoUrl
    }

    res.json(fallback);
  }
});

function generateServerFallback3Plans(numDays: number, budget: string, style: string, preference: string, companion: string, language: string) {
  const isAr = language === 'ar';
  
  const minCost = budget.toLowerCase().includes('low') || budget.toLowerCase().includes('economy') ? 15000 : budget.toLowerCase().includes('luxury') ? 60000 : 30000;
  const maxCost = minCost * 1.8;

  // Helper generator for days
  const makeDays = (city1: string, city2: string, site1: string, site2: string, food1: string, food2: string, hotel: string) => {
    const list = [];
    for (let i = 1; i <= numDays; i++) {
      const city = i % 2 === 1 ? city1 : city2;
      list.push({
        jour: i,
        matin: isAr 
          ? `جولة صباحية في ${city}: زيارة ${i % 2 === 1 ? site1 : site2} واكتشاف المعالم التاريخية والثقافية.` 
          : `Matinée à ${city} : Visite de ${i % 2 === 1 ? site1 : site2} et immersion culturelle au cœur des vestiges.`,
        dejeuner: isAr 
          ? `غداء تقليدي في مطعم محبوب بـ ${city} (${food1} - حوالي 1200 إلى 2500 دج).` 
          : `Déjeuner local à ${city} (${food1} - environ 1200 à 2500 DZD).`,
        apres_midi: isAr 
          ? `استكشاف أزقة ${city} العتيقة والأسواق الشعبية واقتناء الهدايا التذكارية.` 
          : `Après-midi : Promenade dans les souks de ${city} et découverte des ateliers d'artisanat.`,
        hebergement: isAr 
          ? `${hotel} (حي هادئ وموقع ممتاز - 6000 إلى 15000 دج / ليلة).` 
          : `${hotel} (Quartier central et confortable - 6000 à 15000 DZD / nuit).`,
        cafe: isAr 
          ? `استراحة في مقهى تقليدي بـ ${city} لتذوق الشاي بالنعناع مع ${food2}.` 
          : `Pause café/thé à ${city} avec dégustation de ${food2}.`
      });
    }
    return list;
  };

  return {
    plans: [
      {
        nom: isAr ? "Plan A : Route des Ziban et de l'Aurès (Biskra & Batna)" : "Plan A : Route des Ziban et de l'Aurès (Biskra & Batna)",
        resume: isAr 
          ? "Un itinéraire équilibré traversant les gorges impressionnantes des Aurès et les oasis luxuriantes de Biskra. Idéal pour une immersion entre histoire romaine et traditions sahariennes."
          : "Un itinéraire équilibré traversant les gorges impressionnantes des Aurès et les oasis luxuriantes de Biskra. Idéal pour une immersion entre histoire romaine et traditions sahariennes.",
        budget_estime_dzd: { min: minCost, max: maxCost },
        jours: makeDays("Biskra", "Batna", "Gorges de Ghoufi & Balcon de Rhoufi", "Ruines Romaines de Timgad", "Chakhchoukha de Biskra", "Makroud aux dattes", "Hôtel des Ziban Biskra"),
        conseils_pratiques: isAr 
          ? "Transport : Location de voiture ou taxis inter-wilayas. Meilleure période : Octobre à Avril. Prévoir des vêtements chauds pour les nuits dans l'Aurès."
          : "Transport recommandé : Voiture de location ou taxi inter-wilayas. Meilleure période : Octobre à Avril. Prévoyez des vêtements chauds pour les nuits fraîches dans les montagnes.",
        bonus: isAr 
          ? "Visite du canyon caché de M'Chounèche et dégustation des dattes Deglet Nour directement dans la palmeraie."
          : "Visite du canyon caché de M'Chounèche et dégustation des dattes Deglet Nour directement chez le récoltant."
      },
      {
        nom: isAr ? "Plan B : Cœur Historique d'Alger la Blanche & Tipasa" : "Plan B : Cœur Historique d'Alger la Blanche & Tipasa",
        resume: isAr 
          ? "Un circuit culturel captivant reliant les ruelles ottomanes de la Casbah d'Alger aux majestueuses ruines romaines de Tipasa en bord de mer."
          : "Un circuit culturel captivant reliant les ruelles ottomanes de la Casbah d'Alger aux majestueuses ruines romaines de Tipasa en bord de mer.",
        budget_estime_dzd: { min: minCost * 1.1, max: maxCost * 1.15 },
        jours: makeDays("Alger", "Tipasa", "Casbah d'Alger (UNESCO) & Ketchaoua", "Parc Archéologique de Tipasa & Tombeau de la Chrétienne", "Rechta Algéroise au poulet", "Baklawa & Thé à la menthe", "Hôtel Albert 1er Alger"),
        conseils_pratiques: isAr 
          ? "Transport : Métro/Téléphérique à Alger, bus ou taxi privé pour Tipasa. Prenez un guide officiel pour la Casbah."
          : "Transport : Métro, tramway et téléphérique à Alger. Taxi ou bus pour Tipasa. Il est fortement recommandé de prendre un guide agréé pour la Casbah.",
        bonus: isAr 
          ? "Pause thé au coucher du soleil sur le toit d'un Dar traditionnel dans la Casbah avec vue panoramique sur la baie."
          : "Dégustation de poissons frais grillés au port de Tipasa suivi d'un thé sur les toits d'un Dar de la Casbah."
      },
      {
        nom: isAr ? "Plan C : Joyaux de l'Est - Constantine & Guelma" : "Plan C : Joyaux de l'Est - Constantine & Guelma",
        resume: isAr 
          ? "Un voyage spectaculaire à travers la ville des ponts suspendus (Constantine) et les sources thermales naturelles de Guelma."
          : "Un voyage spectaculaire à travers la ville des ponts suspendus (Constantine) et les sources thermales naturelles de Guelma.",
        budget_estime_dzd: { min: minCost * 0.95, max: maxCost * 1.05 },
        jours: makeDays("Constantine", "Guelma", "Pont Sidi M'Cid & Palais Ahmed Bey", "Thermal Cascade de Hammam Debagh", "Djewziya & Trida de Constantine", "Tamina & Café Maure", "Hôtel Cirta Constantine"),
        conseils_pratiques: isAr 
          ? "Transport : Train régional ou voiture. Pensez à réserver l'accès aux hammams thermaux à l'avance en haute saison."
          : "Transport : Train SNTF ou voiture. Prévoyez des maillots de bain pour les sources thermales de Hammam Debagh.",
        bonus: isAr 
          ? "Traversée à pied de la passerelle Perrégaux et achat de la véritable Djewziya artisanale à Bab El Kantara."
          : "Baignade sous les cascades thermales calcaire jaunes de Hammam Chellala (Hammam Debagh)."
      }
    ]
  };
}

function generateServerFallbackItinerary(numDays: number, budget: string, interest: string, language: string) {
  // Localization dictionary
  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const isEs = language === 'es';

  let title = '';
  let overview = '';
  let baseCostPerDay = budget === 'economy' ? 5000 : budget === 'luxury' ? 25000 : 12000;
  
  if (interest === 'desert') {
    title = isAr ? 'سحر الصحراء الكبرى: واحات تغيت وغرداية الكلاسيكية' 
          : isFr ? 'Magie du Sahara : Oasis de Taghit & Ghardaïa'
          : isEs ? 'Magia del Sahara: Oasis de Taghit y Ghardaïa'
          : 'Sahara Mystique: Golden Dunes of Taghit & M’zab Valley';
    overview = isAr ? 'رحلة لا تُنسى عبر عروق الرمل الذهبية في الصحراء الجزائرية، مستكشفين الهندسة الفريدة لوادي ميزاب وواحات تغيت البكر.'
             : isFr ? 'Un voyage inoubliable à travers les dunes d\'or du Sahara, en découvrant l\'architecture unique du M\'zab et l\'oasis préservée de Taghit.'
             : isEs ? 'Un viaje inolvidable a través de las dunas doradas del Sahara, descubriendo la arquitectura única de M\'zab y el oasis virgen de Taghit.'
             : 'An unforgettable voyage through the sweeping dunes of the Algerian Sahara, exploring the magnificent architecture of Ghardaia and the pristine oasis of Taghit.';
  } else if (interest === 'history') {
    title = isAr ? 'نبض التاريخ: من مسارح تيمقاد إلى قصبة الجزائر العتيقة'
          : isFr ? 'Sur les Traces de l\'Histoire : De Timgad à la Casbah d\'Alger'
          : isEs ? 'Huellas de la Historia: De Timgad a la Casbah de Argel'
          : 'Echoes of History: From Roman Timgad to the Ancient Casbah of Algiers';
    overview = isAr ? 'استكشف الآثار الرومانية الشامخة في تيمقاد وتيبازة، ثم تجول في ثنايا التاريخ العثماني بين أزقة قصبة الجزائر العتيقة المعترف بها من اليونسكو.'
             : isFr ? 'Explorez les majestueuses ruines romaines de Timgad et Tipaza, puis plongez dans l\'histoire ottomane au cœur de la Casbah d\'Alger.'
             : isEs ? 'Explore las majestuosas ruines romanas de Timgad y Tipaza, y sumérjase en la historia otomana en el corazón de la Casbah de Argel.'
             : 'Walk through pristine Roman history in the forums of Timgad and coastal ruins of Tipasa, ending with the medieval Ottoman alleys of the Algiers Casbah.';
  } else if (interest === 'culinary') {
    title = isAr ? 'الرحلة الطهوية الرائعة: نكهات وتوابل الجزائر العريقة'
          : isFr ? 'Le Voyage Gourmand : Saveurs, Traditions et Épices d\'Algérie'
          : isEs ? 'Ruta Gastronómica: Sabores, Tradiciones y Especias de Argelia'
          : 'Culinary Expedition: Traditional Spices, Couscous, and Hand-crafted Pastries';
    overview = isAr ? 'استكشف ثقافة الطهي الجزائرية الغنية، من أطباق الرشتة العاصمية والكسكسي القبائلي إلى الشواء التقليدي وحلويات العسل والنعناع.'
             : isFr ? 'Plongez dans la riche culture gastronomique algérienne, de la Rechta algéroise au couscous kabyle, en passant par le thé à la menthe traditionnel.'
             : isEs ? 'Sumergirse en la rica cultura gastronómica argelina, desde la Rechta de Argel hasta el cuscús de Cabilia, además del té tradicional con menta.'
             : 'Indulge in the rich culinary heritage of Algeria, learning about traditional boureks, steaming clay pot couscous, sweet honey baklawa, and aromatic woodfired breads.';
  } else if (interest === 'coastal') {
    title = isAr ? 'لؤلؤة المتوسط: استكشاف شواطئ وهران وعنابة الخلابة'
          : isFr ? 'Perles de la Méditerranée : Côtes d\'Oran et Bejaïa'
          : isEs ? 'Perlas del Mediterráneo: Costas de Orán y Bejaïa'
          : 'Mediterranean Escapes: Coastal Fortresses & Blue Beaches';
    overview = isAr ? 'رحلة على طول الساحل الجزائري الساحر، مستكشفين قلعة سانتا كروز بوهران وخلجان فيجايا الرائعة مع غابات الصنوبر الشامخة.'
             : isFr ? 'Un voyage le long de la magnifique côte algérienne, de l\'historique fort Santa Cruz d\'Oran aux falaises boisées de Bejaïa ou Jijel.'
             : isEs ? 'Un viaje por la hermosa costa de Argelia, desde el histórico fuerte de Santa Cruz de Orán hasta los acantilados boscosos de Bejaïa.'
             : 'A scenic coastal cruise capturing the sparkling Mediterranean, the historic Spanish forts of Oran, and the lush sea cliffs of Bejaia and Jijel.';
  } else {
    title = isAr ? 'جواهر الجزائر الفريدة: العاصمة الأنيقة وجسور قسنطينة المعلقة'
          : isFr ? 'Joyaux d\'Algérie : Alger l\'Blanche & Constantine la Suspendue'
          : isEs ? 'Joyas de Argelia: Argel la Blanca y Constantina la Suspendida'
          : 'Jewels of Algeria: Chic Algiers & Suspended Bridges of Constantine';
    overview = isAr ? 'برنامج متكامل يجمع بين سحر العاصمة العمراني ذو الطراز الفرنسي-المغاربي وجسور قسنطينة المعلقة الرهيبة التي تحبس الأنفاس.'
             : isFr ? 'Un itinéraire culturel complet mariant l\'élégance coloniale d\'Alger la Blanche avec les ponts suspendus spectaculaires de Constantine.'
             : isEs ? 'Un itinerario cultural completo que combina la elegancia colonial de Argel la Blanca con los espectaculares puentes colgantes de Constantina.'
             : 'A pristine cultural odyssey marrying the white French-Moorish avenues of Algiers with the deep ravines and scenic suspended bridges of Constantine.';
  }

  const days = [];
  for (let i = 1; i <= numDays; i++) {
    let locationName = '';
    let dayTitle = '';
    let morning = '';
    let afternoon = '';
    let evening = '';
    let cuisineRecommendation = '';
    let budgetTip = '';

    if (interest === 'desert') {
      if (i % 2 === 1) {
        locationName = 'Ghardaia (M\'zab)';
        dayTitle = isAr ? `اليوم ${i}: استكشاف قصور وادي ميزاب الفريدة`
                 : isFr ? `Jour ${i} : Les Mystères de la Pentapole du M\'zab`
                 : isEs ? `Día ${i}: Los Misterios de la Pentápolis de M\'zab`
                 : `Day ${i}: Ancient Architecture of Ghardaia’s Pentapolis`;
        morning = isAr ? 'زيارة قصر بني يزقن الشهير وحضور سوق المزاد العلني التقليدي لشراء السجاد اليدوي.'
                : isFr ? 'Visite du ksar médiéval de Beni Isguen et exploration du marché traditionnel de la criée.'
                : isEs ? 'Visita del ksar medieval de Beni Isguen y exploración de su mercado tradicional.'
                : 'Tour the UNESCO-listed medieval Ksar of Beni Isguen and browse the traditional open-air auction market.';
        afternoon = isAr ? 'جولة برفقة مرشد محلي مرخص في وادي ميزاب للتعرف على نظام توزيع المياه العبقري.'
                  : isFr ? 'Balade guidée dans la palmeraie et découverte du système ingénieux de partage des eaux.'
                  : isEs ? 'Paseo guiado por el palmeral y descubrimiento del ingenioso sistema de distribución de agua.'
                  : 'Stroll through Ghardaia\'s palm groves and inspect the historic stone gravity wells and underground water canals.';
        evening = isAr ? 'جلسة غروب شمس ساحر أعلى هضاب ميزاب متبوعة بعشاء عائلي تقليدي في منزل تقليدي ميزابي.'
                : isFr ? 'Coucher de soleil magique sur les collines du M\'zab, suivi d\'un dîner chaleureux chez l\'habitant.'
                : isEs ? 'Atardecer mágico en las colinas de M\'zab, seguido de una cena con comida tradicional.'
                : 'Enjoy an authentic rooftop sunset view over the valley, followed by a local dinner featuring spiced dry couscous.';
        cuisineRecommendation = isAr ? 'المردود الميزابي بالخضار العضوية والشاي بالنعناع المحلي'
                              : isFr ? 'Le Mourdoud de Ghardaïa aux légumes du désert et thé saharien'
                              : isEs ? 'El Mourdoud de Ghardaïa y té argelino'
                              : 'Mourdoud (traditional heavy grain desert couscous loaded with rustic roots) and strong desert mint tea with peanuts';
        budgetTip = isAr ? 'احجز مرشداً محلياً معتمداً دائماً لأن دخول القصور يُشترط فيه وجود مرافق احتراما لخصوصية السكان.'
                  : isFr ? 'Prenez toujours un guide officiel local, car l\'accès aux ksour est réglementé pour respecter la vie privée des habitants.'
                  : isEs ? 'Siempre contrate a un guía local oficial, ya que el acceso a los ksour está regulado por la privacidad de los residentes.'
                  : 'Always hire an official local guide; entry to these ancient conservation Ksours requires an approved local companion to respect privacy.';
      } else {
        locationName = 'Taghit Oasis';
        dayTitle = isAr ? `اليوم ${i}: غروب الشمس على الكثبان الرملية الذهبية في تغيت`
                 : isFr ? `Jour ${i} : Dunes Géantes de l'Erg Occidental à Taghit`
                 : isEs ? `Día ${i}: Dunas Gigantes del Erg Occidental en Taghit`
                 : `Day ${i}: Scaling Great Western Erg Dunes in Taghit`;
        morning = isAr ? 'جولة على الأقدام في القصر القديم لتغيت المبنّي بالطين الأحمر واستكشاف واحات النخيل.'
                : isFr ? 'Randonnée dans le ksar historique en pisé rouge de Taghit et visite de l\'ancienne palmeraie.'
                : isEs ? 'Caminata en el ksar histórico de adobe rojo de Taghit y palmeral antiguo.'
                : 'Hike through Taghit\'s red-mud historical fortress (Ksar) and explore the shaded labyrinth of palm oasis trails.';
        afternoon = isAr ? 'مغامرة ركوب سيارات الدفع الرباعي أو ركوب الجمال لنزول الكثبان الرملية العالية.'
                  : isFr ? 'Aventure en 4x4 ou balade à dos d\'un dromadaire sur les dunes géantes qui surplombent l\'oasis.'
                  : isEs ? 'Aventura en 4x4 o paseo en dromedario en las dunas gigantes de arena.'
                  : 'Ride quad bikes or camels to ascend the high sweeping sand dunes overlooking the deep blue Taghit riverbed oasis.';
        evening = isAr ? 'سهرة في مخيم صحراوي تقليدي حول موقد النار تحت سماء مرصعة بالنجوم مع موسيقى القناوة العريقة.'
                : isFr ? 'Soirée contes et musique Gnawa autour d\'un feu de camp saharien sous les étoiles de l\'Erg.'
                : isEs ? 'Soirée de música Gnawa al aire libre bajo un cielo estrellado del Sahara.'
                : 'Savor traditional Mechoui lamb slow-cooked over firewood, accompanied by the hypnotic rhythms of local Gnawa musicians.';
        cuisineRecommendation = isAr ? 'لحم مشوي على الحطب وخبز الملة المطهو تحت الرماد الدافئ'
                              : isFr ? 'L\'agneau cuit à l\'étouffée et le pain traditionnel cuit sous la cendre'
                              : isEs ? 'Cordero asado y pan cocido bajo cenizas del desierto'
                              : 'Khobz El Mela (desert bread flatbaked under clean hot sand embers) and slowly roasted spiced mutton';
        budgetTip = isAr ? 'احمل معك دائما مياهاً كافية وعملات نقدية صغيرة فوسائل الدفع الرقمية منعدمة تماماً في عمق الصحراء.'
                  : isFr ? 'Ayez toujours des espèces sur vous (Dinars), car les cartes bancaires ne sont pas acceptées dans les oasis reculées.'
                  : isEs ? 'Tenga siempre efectivo en mano (Dinar), la mayoría de los comercios desérticos no aceptan tarjetas bancarias.'
                  : 'Bring ample cash (DZD) as bank card payment is practically non-existent in remote desert towns.';
      }
    } else if (interest === 'history') {
      if (i % 2 === 1) {
        locationName = 'Algiers Casbah';
        dayTitle = isAr ? `اليوم ${i}: أسرار قصبة الجزائر العثمانية`
                 : isFr ? `Jour ${i} : Secrets de la Casbah Ottomane d'Alger`
                 : isEs ? `Día ${i}: Secretos de la Casbah Otomana de Argel`
                 : `Day ${i}: Ottoman Secrets of the Algiers Casbah`;
        morning = isAr ? 'النزول من أعالي القصبة، زيارة قصر مصطفى باشا ومسجد كتشاوة التاريخي ذو الطراز البيزنطي-التركي.'
                : isFr ? 'Descente de la Casbah médiévale, visite du palais de Mustapha Pacha et de la mosquée de Ketchaoua.'
                : isEs ? 'Descenso de la Casbah medieval, visita del palacio de Mustapha Pacha.'
                : 'Descend through the narrow cascades of the Casbah, touring Palais Mustapha Pacha and the historic Ketchaoua Mosque.';
        afternoon = isAr ? 'شرب القهوة في مقهى شعبي عتيق، ثم جولة في سوق باب الواد لاقتناء التوابل والصناعات التقليدية.'
                  : isFr ? 'Pause thé dans un café populaire historique, visite d\'un atelier de menuiserie traditionnelle et d\'ébénisterie.'
                  : isEs ? 'Té en un café histórico de la Casbah y visita a artesanos tradicionales de madera.'
                  : 'Sip cardamom tea at an old corner cafe and view woodcarvers restoring traditional Ottoman cedar support beams.';
        evening = isAr ? 'تناول وجبة الشوربة و البوراك الشهية في بيت قصبة دافئ يطل على واجهة البحر الجميلة.'
                : isFr ? 'Savoir-vivre algérois : dîner traditionnel de Rechta dans une belle maison de la Casbah avec vue sur baie.'
                : isEs ? 'Cena con degustación de Rechta argelina en una casa local con vistas a la bahía.'
                : 'Dine inside a restored boutique dar (courtyard house) overlooking the Bay of Algiers, eating hand-stretched soup bourek.';
        cuisineRecommendation = isAr ? 'طبق الرشتة العاصمية بالدجاج والقرفة مع البوراك المقرمش'
                              : isFr ? 'La Rechta algéroise au poulet et navets accompagnée de Boureks dorés'
                              : isEs ? 'Rechta tradicional de pollo con canela y Bourek crujiente'
                              : 'Rechta (Algerian silky noodles cooked in a spiced white chicken gravy with turnip slices and cinnamon) with crispy lemon-spiced potato Boureks';
        budgetTip = isAr ? 'ارتدِ أحذية مريحة جداً نظراً للسلالم والمنحدرات الشديدة والوعرة في أزقة القصبة.'
                  : isFr ? 'Portez des chaussures de marche confortables à cause des nombreuses marches de la Casbah.'
                  : isEs ? 'Lleve zapatos cómodos para caminar debido a las innumerables cuestas y escaleras.'
                  : 'Wear robust walking shoes; the Casbah has thousands of steep steps and slippery cobblestone corridors.';
      } else {
        locationName = 'Tipasa Roman Ruins';
        dayTitle = isAr ? `اليوم ${i}: تيبازة الرومانية والضريح الملكي الموريتاني`
                 : isFr ? `Jour ${i} : Tipaza la Romaine & le Tombeau de la Chrétienne`
                 : isEs ? `Día ${i}: Tipasa Romana y el Gran Mausoleo de Mauritania`
                 : `Day ${i}: Tipasa Coastal Roman Ruins & Royal Mauritanian Mausoleum`;
        morning = isAr ? 'استكشاف المدرج الأثري والآثار الرومانية الشامخة الممتدة على ضفاف البحر الأبيض المتوسط مباشرة.'
                : isFr ? 'Exploration du site archéologique de Tipaza au bord de la Méditerranée et de son théâtre antique.'
                : isEs ? 'Exploración del yacimiento romano de Tipasa directamente frente al mar y su anfiteatro.'
                : 'Tour the archeological ruins of Tipasa, where ancient Roman villas, temples, and amphitheaters directly meet the blue Mediterranean sea.';
        afternoon = isAr ? 'التوقف عند الضريح الملكي الموريتاني (قبر الرومية) والتعرف على لغز الملك يوبا الثاني والملكة كليوباترا سيليني.'
                  : isFr ? 'Visite du monumental Tombeau de la Chrétienne (Mausolée royal mauritanien) perché sur les hauteurs.'
                  : isEs ? 'Visita del monumental Mausoleo Real de Mauritania en una colina con vistas al mar.'
                  : 'Ascend the coastal hills to explore the massive stone circular Tombeau de la Chrétienne (the Royal Mauritanian Mausoleum of Juba II and Cleopatra Selene).';
        evening = isAr ? 'تناول سمك السردين المشوي الطازج في ميناء الصيادين بتيبازة مع غروب الشمس الساحر.'
                : isFr ? 'Coucher de soleil sur le port de Tipaza avec un festin de sardines grillées pêchées du jour.'
                : isEs ? 'Atardecer en el puerto pesquero de Tipaza comiendo sardinas frescas y pescado frito.'
                : 'Enjoy fresh-caught charcoal grilled sardines and crispy calamari directly on the harbor of Tipasa, enjoying the sea breeze.';
        cuisineRecommendation = isAr ? 'سمك السردين المحلي المشوي بالتوابل والكسكسي البحري'
                              : isFr ? 'Sardines marinées à la Chermoula et frites locales'
                              : isEs ? 'Sardinas asadas marinadas con Chermoula'
                              : 'Freshly caught sardines seasoned with Chermoula garlic herb paste and lemon wedges';
        budgetTip = isAr ? 'سعر تذكرة دخول حديقة الآثار رمزي جداً (150 دج)، اشتري تذكرتك من البوابة الرسمية.'
                  : isFr ? 'Le ticket d\'entrée au parc archéologique est très abordable (environ 150 DZD). Prenez un ticket officiel.'
                  : isEs ? 'La entrada al parque arqueológico de Tipasa tiene un precio simbólico muy bajo (150 Dinar).'
                  : 'The entrance fee for the UNESCO archeological ruins is extremely low (around 150 DZD). Buy directly at the ticket window.';
      }
    } else {
      if (i % 2 === 1) {
        locationName = 'Algiers Center';
        dayTitle = isAr ? `اليوم ${i}: معالم الجزائر البيضاء والحدائق الملكية`
                 : isFr ? `Jour ${i} : Alger la Blanche & le Jardin d'Essai d'Hamma`
                 : isEs ? `Día ${i}: Argel la Blanca y el icónico Jardín d'Essai`
                 : `Day ${i}: Algiers Ottoman Palette & Botanic Hamma Gardens`;
        morning = isAr ? 'جولة في حديقة التجارب بالحامة الشهيرة لرؤية أشجار التين البنغالي وموقع تصوير فيلم تارزان الأصلي.'
                : isFr ? 'Visite du Jardin d\'Essai d\'Hamma, fameux jardin botanique tropical classé mondialement.'
                : isEs ? 'Visita del Jardín d\'Essai del Hamma, bosque botánico tropical de renombre internacional.'
                : 'Stroll the lush botanical Hamma Gardens, home to 150-year-old giant dragon trees and the original location of the 1932 Tarzan movie.';
        afternoon = isAr ? 'زيارة مقام الشهيد الشامخ والمتحف الوطني للمجاهد لمعرفة كفاح الشعب الجزائري العظيم لأجل الاستقلال.'
                  : isFr ? 'Montée en téléphérique vers le Monument des Martyrs (Makam El Chahid) pour admirer tout le panorama d\'Alger.'
                  : isEs ? 'Visita al imponente Monumento de los Mártires utilizando el teleférico.'
                  : 'Ride the aerial cable car up to the Monument of Martyrs (Makam El Chahid) for an expansive panorama of the capital and bay.';
        evening = isAr ? 'تناول وجبة عشاء في حي ديدوش مراد وتناول الشاي الأخضر بالنعناع في مقاهيها ذات الطابع الباريسي.'
                : isFr ? 'Balade décontractée sur l\'avenue Didouche Mourad, dîner traditionnel de brochettes et dessert local.'
                : isEs ? 'Cena con brochetas tradicionales y repostería local fina en el vibrante centro de Argel.'
                : 'Walk down central Didouche Mourad Boulevard, dining on spicy Merguez skewers and sweet honey-dipped pastries.';
        cuisineRecommendation = isAr ? 'المثوم العاصمي باللحم المفروم والبهارات الطازجة الشهية'
                              : isFr ? 'Le Mtewem algérois aux amandes et boulettes de viande parfumées à l\'ail'
                              : isEs ? 'Mtewem (albóndigas especiadas con salsa de almendras y ajo)'
                              : 'Mtewem (tender meat balls slow-braised in a rich garlic chickpea reduction, toasted almonds, and olive oil) with warm flatbread';
        budgetTip = isAr ? 'المترو والترامواي في الجزائر رخيصين جداً (50 دج للتذكرة) وهما أفضل وسيلة لتفادي زحمة السير.'
                  : isFr ? 'Utilisez le tramway et le métro, très propres et économiques (50 DZD) pour vous déplacer rapidement.'
                  : isEs ? 'Utilice el metro y tranvía de Argel, son sumamente baratos e ideales para esquivar el tráfico.'
                  : 'Utilize the modern Algiers metro and tramway lines; tickets are only 50 DZD and help avoid heavy rush-hour traffic congestion.';
      } else {
        locationName = 'Constantine Bridges';
        dayTitle = isAr ? `اليوم ${i}: معلق جسور قسنطينة السحري`
                 : isFr ? `Jour ${i} : Constantine, la Cité des Ponts Suspendus`
                 : isEs ? `Día ${i}: Constantina, la majestuosa Ciudad de los Puentes Colgantes`
                 : `Day ${i}: Standing on Constantine’s Suspended Bridges`;
        morning = isAr ? 'العبور فوق جسر سيدي مسيد المعلق الرهيب المطل على وادي الرمال العتيق.'
                : isFr ? 'Traversée du spectaculaire Pont de Sidi M\'Cid surplombant le canyon du Rhumel à 175m de hauteur.'
                : isEs ? 'Cruce peatonal del espectular Puente Sidi M\'Cid a más de 170 metros sobre el abismo del cañón Rhumel.'
                : 'Cross the daring 175-meter high Sidi M\'Cid suspended bridge, looking down into the dramatic limestone Rhumel River canyon.';
        afternoon = isAr ? 'زيارة قصر أحمد باي الأخير في عهد بايات قسنطينة والتعرف على حدائقه الأندلسية الفاتنة.'
                  : isFr ? 'Découverte du magnifique Palais d\'Ahmed Bey et de ses fresques historiques et faïences arabesques.'
                  : isEs ? 'Visita del espectacular Palacio de Ahmed Bey, joya artística del arte otomano con jardines andaluces.'
                  : 'Tour the grand Ahmed Bey Palace, showcasing pristine tile mosaics, citrus filled Andalusian courtyards, and Ottoman battle murals.';
        evening = isAr ? 'تناول طبق الشخشوخة القسنطينية الحارة المصنوعة من رقائق العجين الرقيقة.'
                : isFr ? 'Repas traditionnel authentique : la Shakhshoukha de Constantine aux épices locales parfumées.'
                : isEs ? 'Cena degustando Chajchouja de Constantina picante y té con menta.'
                : 'Savor regional Constantine-style Shakhshoukha, served with spiced lamb cuts, chickpeas, and hot red peppers.';
        cuisineRecommendation = isAr ? 'شخشوخة قسنطينة الحارة بالدجاج واللحم والبهارات الأصلية العريقة'
                              : isFr ? 'La Shakhshoukha de Constantine aux galettes émiettées et sauce rouge relevée'
                              : isEs ? 'Shakhshoukha de Constantina picante con carne'
                              : 'Constantine Shakhshoukha (finely shredded steamed semolina crepes drenched in an aromatic spicy red sauce, garnished with soft chickpeas and lamb)';
        budgetTip = isAr ? 'القطار بين الجزائر العاصمة وقسنطينة نظيف ومريح ورخيص جداً مقارنة بسيارات الأجرة الكبيرة.'
                  : isFr ? 'Le train SNTF reliant Alger à Constantine est très confortable et économique comparé aux navettes privées.'
                  : isEs ? 'El tren de largo recorrido une Argel con Constantina por precios muy económicos y cómodos.'
                  : 'Treat yourself to the SNTF express train linking Algiers to Constantine for a highly scenic, comfortable, and cheap overland journey.';
      }
    }

    days.push({
      dayNumber: i,
      title: dayTitle,
      morning,
      afternoon,
      evening,
      cuisineRecommendation,
      budgetTip,
      estimatedCostDzd: baseCostPerDay + Math.floor(Math.random() * 2000),
      locationName
    });
  }

  const totalEstimatedCostDzd = days.reduce((acc, curr) => acc + curr.estimatedCostDzd, 0);

  return {
    title,
    overview,
    totalEstimatedCostDzd,
    days
  };
}

// Endpoint to serve the XML sitemap with correct content type header
app.get(['/sitemap.xml', '/api/sitemap.xml'], (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    path.join(process.cwd(), 'dist', 'sitemap.xml'),
    path.join(process.cwd(), 'sitemap.xml')
  ];

  let fileContent = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        fileContent = fs.readFileSync(p, 'utf8');
        break;
      } catch (e) {}
    }
  }

  res.header('Content-Type', 'application/xml');
  if (fileContent) {
    res.send(fileContent);
  } else {
    // Highly resilient hardcoded fallback in case of server execution context drift
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.rahala-dz.com/</loc>
    <lastmod>2026-07-12</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  }
});

// Endpoint to serve robots.txt dynamically with correct content type
app.get(['/robots.txt', '/api/robots.txt'], (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'robots.txt'),
    path.join(process.cwd(), 'dist', 'robots.txt'),
    path.join(process.cwd(), 'robots.txt')
  ];

  let fileContent = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        fileContent = fs.readFileSync(p, 'utf8');
        break;
      } catch (e) {}
    }
  }

  res.header('Content-Type', 'text/plain');
  if (fileContent) {
    res.send(fileContent);
  } else {
    // Highly resilient hardcoded fallback
    res.send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.rahala-dz.com/sitemap.xml`);
  }
});

// Google Domain Ownership verification files handlers
app.get(['/google6gDOMKktPz_N-gC9sIkQD9PccmQv289_SU28rti-C5A.html', '/api/google6gDOMKktPz_N-gC9sIkQD9PccmQv289_SU28rti-C5A.html'], (req, res) => {
  res.header('Content-Type', 'text/html');
  res.send('google-site-verification: google6gDOMKktPz_N-gC9sIkQD9PccmQv289_SU28rti-C5A.html');
});

app.get(['/googleg7z-8UKrTUfLchk_6eovt32W0oAZ4bJ7Wq_E7Q-lfg4.html', '/api/googleg7z-8UKrTUfLchk_6eovt32W0oAZ4bJ7Wq_E7Q-lfg4.html'], (req, res) => {
  res.header('Content-Type', 'text/html');
  res.send('google-site-verification: googleg7z-8UKrTUfLchk_6eovt32W0oAZ4bJ7Wq_E7Q-lfg4.html');
});

app.get(['/google4f834482028ee23b.html', '/api/google4f834482028ee23b.html'], (req, res) => {
  res.header('Content-Type', 'text/html');
  res.send('google-site-verification: google4f834482028ee23b.html');
});

// Bing Webmaster Tools XML verification handler
app.get(['/BingSiteAuth.xml', '/api/BingSiteAuth.xml'], (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'BingSiteAuth.xml'),
    path.join(process.cwd(), 'dist', 'BingSiteAuth.xml'),
    path.join(process.cwd(), 'BingSiteAuth.xml')
  ];

  let fileContent = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        fileContent = fs.readFileSync(p, 'utf8');
        break;
      } catch (e) {}
    }
  }

  res.header('Content-Type', 'application/xml');
  if (fileContent) {
    res.send(fileContent);
  } else {
    // Resilient hardcoded fallback
    res.send(`<?xml version="1.0"?>
<users>
	<user>AA5A478BE19FC5916FD8899911FFEC52</user>
</users>`);
  }
});

// Expose public configuration parameters like GOOGLE_MAPS_PLATFORM_KEY
app.get('/api/config', (req, res) => {
  res.json({
    mapsApiKey: process.env.GOOGLE_MAPS_PLATFORM_KEY || ''
  });
});

// Google Places Proxy endpoints to securely fetch real photos without client-side CORS issues
app.get('/api/places/photos', async (req, res) => {
  try {
    const query = req.query.query as string;
    const customKey = req.query.custom_key as string;
    
    if (!query) {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    const apiKey = customKey || process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
    if (!apiKey) {
      // Determine the best premium 100% free photos for Algerian sites
      const normalizedQuery = query.toLowerCase();
      let fallbackPhotos: any[] = [];
      
      if (normalizedQuery.includes('casbah') || normalizedQuery.includes('algiers') || normalizedQuery.includes('alger')) {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1596120206305-c10b0058bcde?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Casbah of Algiers'] },
          { url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Mosque of Algiers'] },
          { url: 'https://images.unsplash.com/photo-1627581165609-b6dc24660eb6?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Historic Moorish architecture'] },
          { url: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Bay view from Casbah heights'] }
        ];
      } else if (normalizedQuery.includes('santa') || normalizedQuery.includes('cruz') || normalizedQuery.includes('oran') || normalizedQuery.includes('wahran')) {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Fort of Santa Cruz, Mt Murdjadjo'] },
          { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Santa Cruz Chapel Sanctuary'] },
          { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Skyline View of Oran Coastal Port'] }
        ];
      } else if (normalizedQuery.includes('tassili') || normalizedQuery.includes('djanet') || normalizedQuery.includes('sahara')) {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1530521951415-32410a74134f?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Stone Forests of Tassili n’Ajjer'] },
          { url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Golden Sand Dunes of Djanet Sahara'] },
          { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Red Sand Canyons of Algerian Desert'] }
        ];
      } else if (normalizedQuery.includes('constantine') || normalizedQuery.includes('bridge') || normalizedQuery.includes('bridges') || normalizedQuery.includes('qasentina')) {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Sidi M’Cid Suspension Bridge'] },
          { url: 'https://images.unsplash.com/photo-1545231027-63b3f16260cd?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Gorges of Rhumel River Canyon'] },
          { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Historic Cliffside Buildings of Constantine'] }
        ];
      } else if (normalizedQuery.includes('timgad') || normalizedQuery.includes('batna') || normalizedQuery.includes('ruins') || normalizedQuery.includes('roman')) {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1627581165609-b6dc24660eb6?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Trajan Arch in Timgad'] },
          { url: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Grid-iron Roman Ruins Street Planning'] },
          { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Ancient Roman Columns of Timgad'] }
        ];
      } else if (normalizedQuery.includes('aurassi') || normalizedQuery.includes('hotel')) {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Premium Algerian Hotel Lounge'] },
          { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Luxury Suite with Sea View'] }
        ];
      } else {
        fallbackPhotos = [
          { url: 'https://images.unsplash.com/photo-1596120206305-c10b0058bcde?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Historical Algeria Scenic Spot'] },
          { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Majestic Atlas Mountains'] },
          { url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=80', html_attributions: ['Unsplash - Algerian Saharan Horizon'] }
        ];
      }

      res.json({
        name: query,
        address: 'Algeria (Offline/Free Fallback Mode)',
        place_id: 'free_fallback_' + query.replace(/\s+/g, '_').toLowerCase(),
        photos: fallbackPhotos.map((p, idx) => ({
          photo_reference: `free_ref_${idx}`,
          height: 800,
          width: 1200,
          html_attributions: p.html_attributions,
          url: p.url
        })),
        isFallback: true
      });
      return;
    }

    // Step 1: Find the place (Text Search)
    // We add "Algeria" to search constraints to focus on Algerian destinations
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' Algeria')}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData: any = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      res.json({ 
        name: query, 
        address: '', 
        photos: [], 
        message: 'No real images available for this place' 
      });
      return;
    }

    // Extract the FIRST (most relevant) result
    const firstResult = searchData.results[0];
    const placeId = firstResult.place_id;

    // Step 2: Get place details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,formatted_address&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData: any = await detailsRes.json();

    if (detailsData.status !== 'OK' || !detailsData.result) {
      res.json({ 
        name: firstResult.name || query, 
        address: firstResult.formatted_address || '', 
        photos: [], 
        message: 'No real images available for this place' 
      });
      return;
    }

    const result = detailsData.result;
    const placeName = result.name || firstResult.name || query;
    const placeAddress = result.formatted_address || firstResult.formatted_address || '';
    
    if (!result.photos || result.photos.length === 0) {
      res.json({ 
        name: placeName, 
        address: placeAddress, 
        photos: [], 
        message: 'No real images available for this place' 
      });
      return;
    }

    // Map photo details and include secure proxy url
    const photos = result.photos.map((photo: any) => {
      let proxyUrl = `/api/places/photo-proxy?photo_reference=${encodeURIComponent(photo.photo_reference)}`;
      if (customKey) {
        proxyUrl += `&custom_key=${encodeURIComponent(customKey)}`;
      }
      return {
        photo_reference: photo.photo_reference,
        height: photo.height,
        width: photo.width,
        html_attributions: photo.html_attributions || [],
        url: proxyUrl
      };
    });

    res.json({
      name: placeName,
      address: placeAddress,
      place_id: placeId,
      photos
    });

  } catch (error: any) {
    console.error('Error fetching real photos:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/places/photo-proxy', async (req, res) => {
  try {
    const photoReference = req.query.photo_reference as string;
    const customKey = req.query.custom_key as string;

    if (!photoReference) {
      res.status(400).send('photo_reference is required');
      return;
    }

    const apiKey = customKey || process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
    if (!apiKey) {
      res.status(400).send('Google Maps API key is missing.');
      return;
    }

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${encodeURIComponent(photoReference)}&key=${apiKey}`;
    
    const photoRes = await fetch(photoUrl);
    
    if (!photoRes.ok) {
      res.status(photoRes.status).send('Failed to fetch photo from Google APIs');
      return;
    }

    const contentType = photoRes.headers.get('content-type') || 'image/jpeg';
    const buffer = await photoRes.arrayBuffer();
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache on client for 24 hours
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error('Error in photo-proxy:', error);
    res.status(500).send('Error loading image');
  }
});

// Serve the local video trailer
app.get('/rahala_trailer.mp4', (req, res) => {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'rahala_trailer.mp4'),
    path.join(process.cwd(), 'dist', 'rahala_trailer.mp4'),
    path.join(process.cwd(), 'rahala_trailer.mp4')
  ];

  let foundPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (foundPath) {
    res.sendFile(foundPath);
  } else {
    // Elegant fallback redirect if the local background download has not finished yet
    res.redirect("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");
  }
});

// Support direct binary uploads of .mp4 videos for Rihla DZ
app.post('/api/upload-video', express.raw({ type: 'video/*', limit: '150mb' }), (req, res) => {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Save to both public and root to satisfy both dev/prod builds
    const rootPath = path.join(process.cwd(), 'rahala_trailer.mp4');
    fs.writeFileSync(rootPath, req.body);
    
    try {
      fs.writeFileSync(path.join(publicDir, 'rahala_trailer.mp4'), req.body);
    } catch (e) {}

    console.log('Video trailer uploaded and saved successfully!');
    res.json({ success: true, url: '/rahala_trailer.mp4' });
  } catch (err: any) {
    console.error('Error handling video upload:', err);
    res.status(500).json({ error: 'Failed to save video on server.', details: err.message });
  }
});

async function downloadDefaultVideo() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const targetPath = path.join(publicDir, 'rahala_trailer.mp4');
  if (fs.existsSync(targetPath)) {
    return;
  }

  // Multi-fallback URL list to ensure high-availability
  const candidateUrls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://www.w3schools.com/html/movie.mp4"
  ];

  let success = false;
  for (const videoUrl of candidateUrls) {
    try {
      console.log(`[Video Cache] Attempting download from: ${videoUrl}`);
      const res = await fetch(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      });
      
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(targetPath, buffer);
        
        // Also copy to root for safe fallback
        const rootPath = path.join(process.cwd(), 'rahala_trailer.mp4');
        fs.writeFileSync(rootPath, buffer);
        
        console.log(`[Video Cache] Successfully cached default video from ${videoUrl}`);
        success = true;
        break;
      } else {
        console.log(`[Video Cache] Status code ${res.status} from ${videoUrl}, trying next fallback...`);
      }
    } catch (err: any) {
      console.log(`[Video Cache] Skipping candidate ${videoUrl} due to connection condition: ${err?.message || 'unavailable'}`);
    }
  }

  if (!success) {
    console.log('[Video Cache] Local cache initialized with streaming fallback mode active.');
  }
}

// Setup Vite dev server or static files static serving mode depending on process.env.NODE_ENV
async function bootstrapServer() {
  // Fire off background downloading task immediately
  downloadDefaultVideo().catch(console.error);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rihla DZ Server running successfully on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  bootstrapServer().catch((err) => {
    console.error('Failed to bootstrap Rihla DZ server:', err);
  });
}

export default app;
