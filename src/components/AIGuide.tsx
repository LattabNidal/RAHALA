import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Compass, 
  HelpCircle, 
  User, 
  Calendar, 
  Shield, 
  Printer, 
  Copy, 
  RefreshCw, 
  ChevronRight, 
  Check,
  TrendingUp,
  Info
} from 'lucide-react';

const destinationTipsData: Record<string, {
  name: { en: string; fr: string; ar: string; es: string };
  etiquette: { en: string[]; fr: string[]; ar: string[]; es: string[] };
  phrases: {
    label: { en: string; fr: string; ar: string; es: string };
    arScript: string;
    arPhonetic: string;
    tmScript: string;
    tmPhonetic: string;
  }[];
}> = {
  general: {
    name: {
      en: "Algeria National Guidance",
      fr: "Conseils Nationaux Algérie",
      ar: "الإرشادات الوطنية العامة للجزائر",
      es: "Consejos Generales de Argelia"
    },
    etiquette: {
      en: [
        "Dress modestly: Out of respect for local customs, keep shoulders and knees covered in public areas.",
        "Greeting custom: A humble handshake is common. Between opposite genders, placing your right hand over your heart with a warm smile is extremely respectful if they don't extend a hand first.",
        "Friday observation: Friday is sacred. Local markets and municipal sights usually pause between 12:00 PM and 3:00 PM.",
        "Hospitality: Algerian hosts are incredibly generous. Accepting tea or coffee with your right hand with a heartfelt 'Sahha' (thank you) is highly appreciated."
      ],
      fr: [
        "Tenue décente : Par respect pour les traditions locales, couvrez vos épaules et vos genoux dans les lieux publics.",
        "Salutations fraternelles : Une poignée de main chaleureuse est courante. Placer la main droite sur le cœur est un signe de profond respect.",
        "Jour du Vendredi : Le vendredi est sacré. Les souks et commerces ferment généralement entre 12h00 et 15h00 pour la grande prière.",
        "Hospitalité légendaire : Accepter le thé de bienvenue avec la main droite en disant 'Sahha' (merci) honore grandement votre hôte."
      ],
      ar: [
        "اللباس المحتشم: احتراماً للثقافة المحلية، يُفضل دائماً ارتداء ملابس ساترة للأكتاف والركبتين في الفضاءات العامة.",
        "آداب التحية العريقة: المصافحة اللطيفة شائعة. وضع اليد اليمنى فوق القلب بابتسامة دافئة يُعد لفتة محترمة وراقية جداً عند تحية الآخرين.",
        "قدسية يوم الجمعة: يوم الجمعة مبارك وسائر المحال والأسواق تأخذ قسطاً من الراحة لأداء الصلاة بين 12:00 و 15:00 زوالاً.",
        "كرم الضيافة الجزائري: إذا قدم لك مضيفك التاي أو القهوة، فاقدِر ضيافته وتناولها بيمينك شاكراً إياه بعبارة 'الله يبارك'."
      ],
      es: [
        "Vestimenta modesta: Por respeto a las normas locales, mantenga cubiertos hombros y rodillas en espacios públicos.",
        "Saludos respetuosos: Un apretón de manos cordial es común. Colocar la mano derecha sobre el pecho es una señal de gran respeto.",
        "Día de oración (Viernes): El viernes es sagrado. La mayoría de los comercios cierran temporalmente entre las 12:00 h y 15:00 h.",
        "Hospitalidad cálida: Aceptar el té de menta con la mano derecha es un bonito gesto de respeto hacia su anfitrión."
      ]
    },
    phrases: [
      {
        label: { en: "Peace be upon you (Hello)", fr: "Que la paix soit sur vous (Bonjour)", ar: "السلام عليكم (التحية)", es: "La paz sea contigo (Hola)" },
        arScript: "السلام عليكم",
        arPhonetic: "Salam Alaykoum",
        tmScript: "ⴰⵣⵓⵍ",
        tmPhonetic: "Azul"
      },
      {
        label: { en: "Thank you", fr: "Merci", ar: "شكراً لك / صحّة", es: "Gracias" },
        arScript: "صحة / شكراً",
        arPhonetic: "Sahha / Shukran",
        tmScript: "ⵜⴰⵏⵎⵉⵔⵜ",
        tmPhonetic: "Tanmirt"
      },
      {
        label: { en: "How are you?", fr: "Comment ça va ?", ar: "كيف حالك؟", es: "¿Cómo estás?" },
        arScript: "واش راك؟ (m) / واش راكي؟ (f)",
        arPhonetic: "Wash rak? (m) / Wash raki? (f)",
        tmScript: "ⴰⵎⴻⴽ ⵜⴻⵍⵍⵉⴹ؟",
        tmPhonetic: "Amek tellid?"
      },
      {
        label: { en: "God willing / Hopefully", fr: "Si Dieu le veut / Espérons", ar: "إن شاء الله", es: "Si Dios quiere" },
        arScript: "إن شاء الله",
        arPhonetic: "Insha'Allah",
        tmScript: "ⵉⵏⵛⴰⵍⵍⴰⵀ",
        tmPhonetic: "Inshallah"
      }
    ]
  },
  algiers: {
    name: {
      en: "Algiers & Historic Casbah",
      fr: "Alger & Casbah Historique",
      ar: "الجزائر العاصمة والقصبة العريقة",
      es: "Argel y la Casbah Histórica"
    },
    etiquette: {
      en: [
        "Alleys Consent: Do not photograph residents, children, or private doorways in the tight Casbah streets without smiling and asking for consent first.",
        "Footwear: The Casbah's cobblestone pathways are vertical, steep, and can be highly slippery. Wear high-traction flat shoes.",
        "Historical respect: Keep voices lowered when entering the historic Ottoman courtyards within the Casbah, as many house multi-generational families."
      ],
      fr: [
        "Photos dans la Casbah : Ne prenez pas de photos des habitants ou de leurs portes sans demander gentiment leur accord.",
        "Chaussures confortables : Les ruelles de la Casbah sont escarpées et glissantes. Privilégiez des chaussures de marche antidérapantes.",
        "Respect résidentiel : Baissez le ton dans les anciens palais et dars, car ce sont des espaces de vie de familles résidentes."
      ],
      ar: [
        "التصوير في القصبة: يرجى عدم تصوير السكان أو أطفالهم أو المداخل الخاصة دون الابتسام وطلب الإذن بأسلوب ودود.",
        "أحذية مناسبة: منحدرات وسلالم القصبة العتيقة صخرية ملساء وقد تكون زلقة جداً. ارتدِ حذاءً مسطحاً ومريحاً للغاية.",
        "احترام السكينة العامة: تذكر أن بيوت القصبة ودويراتها العثمانية تسكنها عائلات منذ أجيال، لذا يرجى خفض الصوت احتراماً لخصوصيتهم."
      ],
      es: [
        "Fotos y respeto: Evite fotografiar a los residentes, niños o accesos privados en la Casbah sin pedir permiso amablemente.",
        "Calzado seguro: Las escaleras de piedra de la Casbah se vuelven resbaladizas. Es fundamental usar calzado plano antideslizante.",
        "Privacidad de las Dars: Mantenga un tono de voz moderado dentro de las viviendas históricas; muchas son hogares familiares activos."
      ]
    },
    phrases: [
      {
        label: { en: "Where is the Casbah museum?", fr: "Où se trouve le musée de la Casbah ?", ar: "أين يقع متحف القصبة؟", es: "¿Dónde está el museo de la Casbah?" },
        arScript: "وين راه متحف القصبة؟",
        arPhonetic: "Win rah mathaf el qasba?",
        tmScript: "ⴰⵏⴷⴰ ⵢⴻⵍⵍⴰ ⵎⵓⵣⵉ ⵍⵇⴻⵚⴱⴰ؟",
        tmPhonetic: "Anda yella muzi el qesba?"
      },
      {
        label: { en: "This is very beautiful", fr: "C'est très beau", ar: "هذا جميل جداً", es: "Esto es muy hermoso" },
        arScript: "هذا شباب بزاف",
        arPhonetic: "Hada chbab bezzaf",
        tmScript: "ⵛⴱⵉⵀ ⴰⵟⵟⴰⵙ",
        tmPhonetic: "Shbih attas"
      },
      {
        label: { en: "Thank you very much", fr: "Merci infiniment", ar: "شكراً جزيلاً / صحة بزاف", es: "Muchas gracias" },
        arScript: "الله يستررك / صحة بزاف",
        arPhonetic: "Allah yastrak / Sahha bezzaf",
        tmScript: "ⵜⴰⵏⵎⵉⵔⵜ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ",
        tmPhonetic: "Tanmirt tameqrant"
      }
    ]
  },
  constantine: {
    name: {
      en: "Constantine's Ravines & Bridges",
      fr: "Constantine & Ses Ravins",
      ar: "قسنطينة مدينة الجسور والوديان",
      es: "Constantina y sus Puentes"
    },
    etiquette: {
      en: [
        "Suspended Bridge Safety: Hold on to your belongings and hats; strong gusts of wind whip through the spectacular Rhumel Gorge.",
        "Malouf Elegance: Constantine is famous for its elegant Andalusian Arab-Islamic legacy (Malouf music and embroidery). Expressing admiration for their cultural preservation is warmly received."
      ],
      fr: [
        "Sécurité sur les ponts : Surveillez vos affaires et téléphones s'il y a du vent au-dessus des gorges spectaculaires du Rhumel.",
        "Tradition ciselée : Constantine est la capitale du Malouf (musique arabo-andalouse) et du velours brodé. S'intéresser à cet art réjouit les artisans."
      ],
      ar: [
        "الأمان على الجسور المعلقة: احرص على تماسك أغراضك وهاتفك؛ فالرياح قد تكون قوية جداً فوق وادي الرمال الساحر.",
        "أصالة الفن القسنطيني: تفتخر المدينة بموسيقى المالوف الأندلسية العريقة وصناعة قشابية القطيفة المطرزة بالذهب. التعبير عن تقديرك لهذا يفتح لك قلوب الجميع."
      ],
      es: [
        "Seguridad en los puentes: Tenga especial cuidado con los objetos personales ligeros; suele haber fuertes ráfagas de viento sobre el río Rhumel.",
        "Aprecio a la cultura Malouf: Constantina tiene orgullo de sus raíces musicales andalusíes y bordados de terciopelo. Interesarse por su arte agrada mucho."
      ]
    },
    phrases: [
      {
        label: { en: "Beautiful bridge", fr: "Splendide pont", ar: "جسر جميل", es: "Hermoso puente" },
        arScript: "جسر شباب بزاف",
        arPhonetic: "Gisr chbab bezzaf",
        tmScript: "ⵜⵉⵜ杠ⴰⵔⵜ ⵜⴰⵛⴱⵉⵃⵜ",
        tmPhonetic: "Titgart tashbiht"
      },
      {
        label: { en: "How much is this Shakhshoukha?", fr: "Combien coûte cette Shakhshoukha ?", ar: "بكم صحن الشخشوخة؟", es: "¿Cuánto cuesta esta Shakhshoukha?" },
        arScript: "بشحال هادي الشخشوخة؟",
        arPhonetic: "Bshal hadi el chakhchoukha?",
        tmScript: "ⵛⵃⴰⵍ ⵜⴻⵚⵡⴰ ⵛⴰⵅⵛⵓⵅⴰ؟",
        tmPhonetic: "Chhal teswa chakhchoukha?"
      }
    ]
  },
  ghardaia: {
    name: {
      en: "Ghardaia & Custom M'zab Codes",
      fr: "Ghardaïa & Codes du M'zab",
      ar: "غرداية وقوانين وادي ميزاب الصارمة",
      es: "Ghardaïa y Leyes del Valle de M'zab"
    },
    etiquette: {
      en: [
        "Guide Requirement: You MUST enter the historical Ksours (fortified towns) accompanied by an authorized local guide. Unaccompanied tourists are turned away out of respect for communal privacy.",
        "Strict No-Photography: Do not photograph local women (who wear the unique one-eye white wool wrap, the Haïk) or close-ups of local men without rare privilege. Cameras should be pointed at buildings only.",
        "Local Prohibition: Smoking, chewing gum in public, playing loud music, and wearing shorts/sleeveless tops are strictly banned inside raw historical Ksours."
      ],
      fr: [
        "Guide officiel obligatoire : L'accès aux ksour préservés requiert d'être accompagné par un guide bénévole local agréé pour garantir l'intimité des familles.",
        "Photos interdites : Il est strictement interdit de photographier les femmes mozabites (en voile blanc Haïk à œil unique) ainsi que les habitants en gros plan.",
        "Restrictions sacrées : Ne fumez pas, ne mâchez pas de chewing-gum, n'écoutez pas de musique forte et ne portez pas de débardeurs ou shorts dans l'enceinte des ksour."
      ],
      ar: [
        "مرافقة مرشد محلي إجباري: يُمنع منعاً باتاً دخول قصور ميزاب الأثرية المحصنة دون مرشد سياحي محلي معتمد لتوضيح خصوصية العمران والتقيد بالأخلاق.",
        "منع تصوير الأشخاص الصارم: يُمنع منعاً باتاً تصوير النساء الميزابيات اللواتي يرتدين الحايك الأبيض التقليدي (العوينة)، وتجنب تصوير الأشخاص في لقطات مقربة.",
        "محظورات داخل القصور: يُمنع التدخين، ومضغ اللبان، وتشغيل الموسيقى الصاخبة، وارتداء السراويل القصيرة (الشورت) أو الملابس الكاشفة للأكتاف تماماً داخل القصر."
      ],
      es: [
        "Guía oficial obligatorio: Para ingresar a los antiguos Ksours fortificados es imprescindible la compañía de un guía local autorizado para salvaguardar la intimidad.",
        "Prohibido fotografiar personas: Está terminantemente prohibido tomar fotos de personas locales, en especial de las raíces de sus mujeres que visten el velo tradicional blanco de un ojal (Haïk).",
        "Códigos de conducta strictly: No fume, no masque chicle, evite la ropa descubierta como pantalones cortos dentro de las villas preservadas del M'zab."
      ]
    },
    phrases: [
      {
        label: { en: "Peace and welcome", fr: "La paix et bienvenue", ar: "السلام والترحيب", es: "Paz y bienvenida" },
        arScript: "مرحباً بكم / ربي يحفظكم",
        arPhonetic: "Marhaban bikum / Rabi yahfadhkom",
        tmScript: "ⴰⵣⵓﻠ / ⴰⵙⵙⴰⵍⴰⵡ ⴼⴻⵍⵍⴰⵡⴻⵏ",
        tmPhonetic: "Azul / Assalaw fellawen"
      },
      {
        label: { en: "Is this hand-woven?", fr: "Est-ce tissé à la main ?", ar: "هل هذا سجاد منسوج يدوياً؟", es: "¿Esto es tejido a mano?" },
        arScript: "مخدوم باليد؟ (الزربية)",
        arPhonetic: "Makhdoum bel-yed?",
        tmScript: "ⵉⵜⵜⵓⴳⴰ ⵙ ⵓⴼⵓⵙ؟",
        tmPhonetic: "Ittuga s ufus?"
      }
    ]
  },
  taghit: {
    name: {
      en: "Saharan Desert Oasis (Taghit)",
      fr: "Oasis Saharienne (Taghit)",
      ar: "واحات ورمال تغيت والصحراء الكبرى",
      es: "Oasis del Sahara y Taghit"
    },
    etiquette: {
      en: [
        "The Mint Tea Ritual: When served desert mint tea, try to accept it. It is polite to finish the cup. Leaving the third cup half-finished is considered wasting blessing.",
        "Water conservation: In dry Sahara oases, water is a highly sacred resource distributed by ancient gravity networks. Never pollute running water paths or dams.",
        "Leave No Trace: The Sahara desert looks pristine and timeless, but ecosystem pollution remains forever. Keep all wrappers and plastics on you."
      ],
      fr: [
        "Le Rite du Thé Saharien : Acceptez toujours le verre de thé de bienvenue servi mousseux. Le thé du désert est un honneur sacré.",
        "Préservation de l'eau : L'eau est extrêmement rare. Les palmeraies sont irriguées par l'ancien système des Foggara; respectez ces canaux sacrés.",
        "Respect écologique : Le désert préserve les traces à jamais. Ramassez tous vos déchets plastiques et ne touchez pas aux gravures rupestres préhistoriques."
      ],
      ar: [
        "طقوس الشاي الصحراوي: عندما يقدم لك مضيف صحراوي كأساً من التاي برغوته الشهيرة، اقبله بامتنان. فالشاي عندهم تعبير عن رفعة الضيف وصداقته.",
        "المحافظة الشديدة على المياه: في واحات الصحراء، الماء سر الحياة ويوزع عبر قنوات السقي التاريخية (الفقارات). احذر تلوث مجاري المياه أو السدود.",
        "لا تترك أثراً: الصحراء شاسعة ولكن البلاستيك والنفايات لا تتحلل في بيئتها. احرص على جمع مخلفاتك وحماية الرسوم الحجرية التاريخية."
      ],
      es: [
        "Ritual del té de menta sahariano: Siempre acepte el té que le ofrezcan. Se sirve tres veces y es un símbolo sagrado de bienvenida en el desierto.",
        "Cuidado del agua: En los oasis, el agua es sumamente escasa y se gestiona mediante antiguos acueductos. Respete estas fuentes y presérvelas limpias.",
        "Sin rastro ecológico: Recoja todo residuo plástico o basura; las huellas en el desierto permanecen largo tiempo e impactan su delicado ecosistema."
      ]
    },
    phrases: [
      {
        label: { en: "The tea is delicious", fr: "Le thé est délicieux", ar: "التاي لذيذ جداً", es: "El té de menta es delicioso" },
        arScript: "التاي بنين بزاف، ربي يعيشك",
        arPhonetic: "At-tay bnin bezzaf, rabi ya'aychak",
        tmScript: "ⴰⵜⴰⵢ ⵉⵢⴻⵍⵀⴰ ⴰⵟⵟⴰⵙ",
        tmPhonetic: "Atay iyelha attas"
      },
      {
        label: { en: "Where is the water?", fr: "Où est l'eau ?", ar: "أين يوجد الماء؟", es: "¿Dónde hay agua?" },
        arScript: "وين راه الماء؟",
        arPhonetic: "Win rah el-ma?",
        tmScript: "ⴰⵏⴷⴰ ⵢⴻⵍⵍⴰ ⵡⴰⵎⴰⵏ؟",
        tmPhonetic: "Anda yella waman?"
      }
    ]
  },
  tipasa: {
    name: {
      en: "Tipasa Roman Archeology",
      fr: "Ruines Romaines de Tipasa",
      ar: "تيبازة والآثار الرومانية الساحلية",
      es: "Arqueología Romana de Tipasa"
    },
    etiquette: {
      en: [
        "Ancient Stone care: Do not walk upon, sit, or lean on fragile historic Roman mosaics, tombs, or low columns. Respect barricades.",
        "Coastal Respectness: Tipasa's ruins border stunning beaches. Keep bathing suits for sandy areas only; dress respectfully in the historical park."
      ],
      fr: [
        "Préservation des pierres : Ne montez pas sur les ruines romaines, colonnes, ou sarcophages. Respectez scrupuleusement les balises historiques.",
        "Respect côtier : Les ruines côtoient la mer. Réservez les maillots aux plages de baignade et habillez-vous de façon décente pour visiter le parc."
      ],
      ar: [
        "حماية الحجر الأثري: يرجى عدم الجري أو الوقوف أو الجلوس على بقايا الفسيفساء الرومانية الهشة، أو التوابيت الحجرية، أو الأعمدة الأثرية.",
        "احترام الشواطئ: تطل آثار تيبازة على شواطئ ساحرة. كُن حريصاً على تغطية الجسد واللباس المحتشم فور مغادرتك الرمال ودخولك للمتنزه الأثري العتيق."
      ],
      es: [
        "Conservación arqueológica: No camine, se siente ni se apoye sobre los antiguos mosaicos romanos o columnas sensibles. Respete las zonas delimitadas.",
        "Decoro costero: Las ruinas colindan con calas hermosas. Mantenga los trajes de baño exclusivamente en las playas y vístase decorosamente en el parque."
      ]
    },
    phrases: [
      {
        label: { en: "Where are the Roman ruins?", fr: "Où sont les ruines romaines ?", ar: "أين توجد الآثار الرومانية؟", es: "¿Dónde están las ruinas romanas?" },
        arScript: "وين جاو الأثر الروماني؟",
        arPhonetic: "Win jaw el-athar el-roumani?",
        tmScript: "ⴰⵏⴷⴰ ⵇⵇⵉⵎⴻⵏ ⵉⵔⵓⵎⴰⵏⵉⵢⴻⵏ؟",
        tmPhonetic: "Anda qqimen irumaniyen?"
      },
      {
        label: { en: "Is this fish fresh?", fr: "Est-ce du poisson frais ?", ar: "هل هذا السمك طازج؟", es: "¿El pescado es fresco?" },
        arScript: "الحوت جديد؟",
        arPhonetic: "El-hout jdid?",
        tmScript: "ⴰⵙⵍⴻⵎ ⴷ ⴰⵊⴷⵉⴷ؟",
        tmPhonetic: "Aslem d ajdid?"
      }
    ]
  }
};

const getMatchedDestinationKey = (locationName: string): string => {
  const norm = (locationName || '').toLowerCase();
  if (norm.includes('algiers') || norm.includes('alger') || norm.includes('عاصمة')) return 'algiers';
  if (norm.includes('constantine') || norm.includes('قسنطينة')) return 'constantine';
  if (norm.includes('ghardaia') || norm.includes('ghardaïa') || norm.includes('m\'zab') || norm.includes('mzab') || norm.includes('غرداية')) return 'ghardaia';
  if (norm.includes('taghit') || norm.includes('desert') || norm.includes('sahara') || norm.includes('تغيت') || norm.includes('صحراء')) return 'taghit';
  if (norm.includes('tipasa') || norm.includes('تيبازة')) return 'tipasa';
  return 'general';
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const plannerLabels = {
  tabChat: {
    en: '💬 Local Guide Chat',
    fr: '💬 Causerie du Guide',
    ar: '💬 مرشد سياحي فوري',
    es: '💬 Guía Local'
  },
  tabPlanner: {
    en: '🗺️ Day-by-Day Itinerary',
    fr: '🗺️ Planificateur d’Itinéraire',
    ar: '🗺️ مخطط مسار الرحلة',
    es: '🗺️ Itinerario Personalizado'
  },
  titlePlanner: {
    en: 'Rihla DZ Itinerary Architect',
    fr: 'Architecte d’Itinéraire Rihla DZ',
    ar: 'مهندس رِحلات الجزائر الذكي',
    es: 'Planificador de Itinerarios Rihla'
  },
  subtitlePlanner: {
    en: 'Draft a hand-crafted, culturally rich day-by-day vacation program tailored entirely to your interests.',
    fr: 'Concevez un programme culturel et gastronomique jour par jour entièrement personnalisé.',
    ar: 'صمم برنامجاً طهويّاً وثقافياً متكاملاً يوماً بعد يوم مخصصاً تماماً لاهتماماتك وميزانيتك في الجزائر.',
    es: 'Diseñe un itinerario día por día adaptado a su presupuesto, tiempo e intereses.'
  },
  labelBudget: {
    en: 'Select Budget Style',
    fr: 'Style de Budget',
    ar: 'أسلوب ومستوى الميزانية',
    es: 'Estilo de Presupuesto'
  },
  labelDuration: {
    en: 'Trip Duration (Days)',
    fr: 'Durée du Séjour (Jours)',
    ar: 'مدة الاستكشاف (أيام)',
    es: 'Duración del viaje (Días)'
  },
  labelInterest: {
    en: 'Primary Travel Interest',
    fr: 'Centre d\'Intérêt Principal',
    ar: 'الاهتمام والعناية السياحية الرئيسية',
    es: 'Interés Turístico Principal'
  },
  btnGenerate: {
    en: '✨ Generate My Algerian Itinerary',
    fr: '✨ Générer l’Itinéraire National',
    ar: '✨ توليد مسار الرحلة الوطني المخصص',
    es: '✨ Generar Itinerario de Viaje'
  },
  economyTitle: {
    en: 'Economy Explorer',
    fr: 'Éco-Explorateur',
    ar: 'اقتصادي استكشافي',
    es: 'Economía'
  },
  economyDesc: {
    en: 'Local street eats, shared transport, cosy family homestays.',
    fr: 'Repas de rue typiques, bus/trains locaux, chambres d’hôtes simples.',
    ar: 'وجبات شعبية شهية، مواصلات عامة ممتعة وقطارات، فنادق مريحة.',
    es: 'Comida callejera, transporte público y hostales acogedores.'
  },
  moderateTitle: {
    en: 'Moderate Traveler',
    fr: 'Voyageur Confort',
    ar: 'ميزانية متوسطة',
    es: 'Viajero Confort'
  },
  moderateDesc: {
    en: 'Comfortable rail travel, historical mansions, gourmet diners.',
    fr: 'Trains couchettes confortables, gites de charme, bons dîners.',
    ar: 'قطارات مريحة، دور ضيافة عتيقة مرخصة، عشاء أصيل في المطاعم.',
    es: 'Vías cómodas de tren, casas de huéspedes y cenas gourmet.'
  },
  luxuryTitle: {
    en: 'Luxury VIP',
    fr: 'VIP Prestige',
    ar: 'فاخر VIP أميري',
    es: 'Prestigio VIP'
  },
  luxuryDesc: {
    en: 'Boutique 5★ palaces, private local guides, premium fine dining.',
    fr: 'Hôtels d’époque 5 étoiles, guide et chauffeur privé, haute gastronomie.',
    ar: 'أجنحة وفنادق 5 نجوم عريقة، مرشد وباقة سائق مخصصة، ضيافة أميرية حصرية.',
    es: 'Palacios de época de 5★, transporte privado y el mejor menú gourmet.'
  },
  totalBudget: {
    en: 'Estimated Trip Investment:',
    fr: 'Investissement Total Estimé :',
    ar: 'الاستثمار المالي الإجمالي المقدر:',
    es: 'Presupuesto Total Estimado:'
  },
  morningTitle: {
    en: '🌅 Morning Exploration',
    fr: '🌅 Matinée Découverte',
    ar: '🌅 الفترة الصباحية والنشاط',
    es: '🌅 Mañana Histórica'
  },
  afternoonTitle: {
    en: '☀️ Afternoon Sightseeing',
    fr: '☀️ Après-midi Aventure',
    ar: '☀️ الظهيرة والمسارات الهامة',
    es: '☀️ Tarde de Aventura'
  },
  eveningTitle: {
    en: '🌙 Evening & Gastronomy',
    fr: '🌙 Soirée & Saveurs',
    ar: '🌙 المساء والضيافة والطهي الأصيل',
    es: '🌙 Noche y Gastronomía'
  },
  cuisineBadge: {
    en: '🍛 Culinary Spotlight',
    fr: '🍛 Halte Gastronomique',
    ar: '🍛 ميزة الطبخ والحلويات',
    es: '🍛 Especialidad del Día'
  },
  budgetTipTitle: {
    en: '💡 Local Wisdom',
    fr: '💡 Conseil du bled',
    ar: '💡 حكمة ووصية مَحليّة',
    es: '💡 Consejo del Lugar'
  },
  btnPrint: {
    en: '🖨️ Print / Save PDF',
    fr: '🖨️ Imprimer l\'Itinéraire',
    ar: '🖨️ طباعة أو حفظ كملف PDF',
    es: '🖨️ Imprimir Itinerario'
  },
  btnCopy: {
    en: '📋 Copy Text',
    fr: '📋 Copier le Plan',
    ar: '📋 نسخ البرنامج للحافظة',
    es: '📋 Copiar Itinerario'
  },
  copiedMsg: {
    en: 'Itinerary copied successfully!',
    fr: 'Itinéraire copié dans le presse-papiers !',
    ar: 'تم نسخ مسار الرحلة بنجاح!',
    es: '¡Copiado al portapapeles!'
  },
  askGuide: {
    en: '💬 Ask Guide for detailed logistics',
    fr: '💬 Questionner le guide sur ce plan',
    ar: '💬 اسأل مرشدنا عن لوجستيات هذا البرنامج وعن التنقل',
    es: '💬 Consultar al guía sobre esto'
  },
  actionsHeader: {
    en: 'Itinerary Actions',
    fr: 'Actions d’itinéraire',
    ar: 'إجراءات مسار الرحلة',
    es: 'Acciones de Itinerario'
  },
  interestCulture: {
    en: '✨ Culture & Suspended Bridges (Algiers, Constantine)',
    fr: '✨ Culture & Villes des Ponts (Alger, Constantine)',
    ar: '✨ الثقافة والجسور المعلقة (الجزائر الوسطى، قسنطينة)',
    es: '✨ Cultura y Puentes Colgantes (Argel, Constantina)'
  },
  interestDesert: {
    en: '🏜️ Desert & Sahara (Taghit, Ghardaia)',
    fr: '🏜️ Désert & Sahara (Taghit, Ghardaïa)',
    ar: '🏜️ سحر الصحراء الكبرى (تغيت، غرداية، جانت)',
    es: '🏜️ Desierto y Sahara (Taghit, Ghardaïa)'
  },
  interestHistory: {
    en: '🏛️ History & Ruins (Timgad, Tipasa, Casbah)',
    fr: '🏛️ Histoire & Ruines (Timgad, Tipasa, Casbah)',
    ar: '🏛️ التاريخ والآثار العتيقة (تيمقاد، تيبازة، القصبة)',
    es: '🏛️ Historia y Ruinas (Timgad, Tipasa, Casbah)'
  },
  interestCulinary: {
    en: '🍛 Culinary & Gourmet (Markets, Traditional Dinners)',
    fr: '🍛 Gastronomie & Épices (Restaurants, Souks)',
    ar: '🍛 المطبخ والأصيل (الشخشوخة، الرشتة، الشواء)',
    es: '🍛 Gastronomía y Gourmet (Cuscús, Especias, Souks)'
  },
  interestCoastal: {
    en: '🏖️ Mediterranean Coast (Oran, Bejaia, Jijel)',
    fr: '🏖️ Côte Méditerranéenne (Oran, Bejaïa, Jijel)',
    ar: '🏖️ شواطئ المتوسط (وهران، بجاية، جيجل الباهرة)',
    es: '🏖️ Costa Méditerránea (Orán, Bejaia, Jijel)'
  }
};

const loadingPhrases = {
  en: [
    "Plotting authentic tracks and local alleys...",
    "Consulting historical archives and Casbah cartography...",
    "Sourcing authentic traditional cooks for local spots...",
    "Estimating regional transit dynamics and train logistics...",
    "Adding Saharan desert desert camp wisdom..."
  ],
  fr: [
    "Tracé de l'itinéraire sur la Casbah d'Alger...",
    "Recherche de maisons d'hôtes agréées et de gîtes...",
    "Calcul des budgets et des astuces locales...",
    "Sélection de thé à la menthe et halte à Constantine...",
    "Consultation de l'Architecte Rihla DZ..."
  ],
  ar: [
    "يرسم مهندس رِحلاتنا مسارك العتيق عبر القصبة و الجسور المعلقة...",
    "نبحث عن غرف ضيافة جزائرية أصيلة ومرخصة...",
    "نستحضر دلة شاي صحراوي ميزابي دافئ مع المكسرات...",
    "نحسب التقديرات المالية والقطارات لتناسب ميزانيتك...",
    "ننسق المسافات الفاصلة بين كبرى مدن الجزائر المتنوعة..."
  ],
  es: [
    "Trazando rutas locales y pasajes históricos...",
    "Consultando guías locales sobre la Casbah de Argel...",
    "Buscando tradicionales cocinas locales y carnes al carbón...",
    "Calculando costes y transporte óptimo para Argelia...",
    "Añadiendo consejos prácticos y logística de seguridad..."
  ]
};

export const AIGuide: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser } = useApp();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'chat' | 'planner'>('chat');
  
  // Itinerary Planner states
  const [budgetStyle, setBudgetStyle] = useState<'economy' | 'moderate' | 'luxury'>('moderate');
  const [interestType, setInterestType] = useState<string>('culture');
  const [tripDays, setTripDays] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itineraryResult, setItineraryResult] = useState<any>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  // Quick Tips states
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [selectedTipDest, setSelectedTipDest] = useState<string>('general');

  const itineraryDestinations = React.useMemo(() => {
    if (!itineraryResult || !itineraryResult.days) return ['general'];
    const keys = new Set<string>();
    keys.add('general');
    itineraryResult.days.forEach((day: any) => {
      const key = getMatchedDestinationKey(day.locationName || '');
      keys.add(key);
    });
    return Array.from(keys);
  }, [itineraryResult]);

  useEffect(() => {
    if (itineraryResult && itineraryResult.days && itineraryResult.days.length > 0) {
      const keys = itineraryResult.days.map((day: any) => getMatchedDestinationKey(day.locationName || ''));
      const nonGeneral = keys.find((k: string) => k !== 'general');
      if (nonGeneral) {
        setSelectedTipDest(nonGeneral);
      } else {
        setSelectedTipDest('general');
      }
    } else {
      setSelectedTipDest('general');
    }
  }, [itineraryResult]);

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'ai',
        text: language === 'ar' 
          ? 'مرحباً بك! أنا مرشدك السياحي الذكي المخصص لرحلتك في الجزائر. اسألني عن أي شيء، مثل تاريخ القصبة العريق، أو تحف الطبخ الوهراني، أو تخطيط برنامج لزيارة جسور قسنطينة المعلقة ولماذا تبكي البقرة في طاسلي؟'
          : language === 'fr'
          ? "Bienvenue ! Je suis votre guide touristique intelligent pour l'Algérie. Posez-moi vos questions sur l'histoire de la Casbah, la cuisine de l'Oranie, ou comment organiser un voyage à Constantine."
          : language === 'es'
          ? "¡Bienvenido! Soy su guía turístico inteligente para Argelia. Pregúnteme sobre la historia de la Casbah, la comida tradicional o cómo organizar un viaje."
          : 'Cruising through Algeria? Ask me anything! I am your AI local guide for food recommendations in Algiers, historic context of Constantine, or logistics of a Sahara expedition.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPills = [
    { en: '🍛 Top Algerian Foods to try', fr: '🍛 Spécialités culinaires à tester', ar: '🍛 أشهر المأكولات الجزائرية الشعبية', es: '🍛 Comidas argelinas tradicionales' },
    { en: '🏛️ 3-day Constantine itinerary', fr: '🏛️ Itinéraire de 3 jours à Constantine', ar: '🏛️ برنامج سياحي لقسنطينة في 3 أيام', es: '🏛️ Itinerario de 3 días en Constantina' },
    { en: '🐪 Tips for visiting Sahara desert', fr: '🐪 Conseils pour visiter le Sahara', ar: '🐪 نصائح هامة لزيارة الصحراء والجانب الأمني', es: '🐪 Consejos para visitar el desierto del Sahara' },
    { en: '🎭 Quick history of Algiers Casbah', fr: '🎭 Histoire de la Casbah d’Alger', ar: '🎭 نبذة تاريخية عن قصبة الجزائر العتيقة', es: '🎭 Breve historia de la Casbah de Argel' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  // Loading animation phrases loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % 5);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputVal;
    if (!textToSend.trim()) return;

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    setErrorMessage(null);

    try {
      // Call server-side API proxy for Gemini Chat Grounding
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          language: language,
          isPremium: currentUser?.isPremium || false
        })
      });

      if (!response.ok) {
        throw new Error('Server API failed to reply or Gemini Key is unset');
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (err: any) {
      setTimeout(() => {
        const fallbacks: { [key: string]: string } = {
          ar: 'الجزائر بلد عظيم وجميل! من أجل استكشاف تاريخه العريض ومطبخه اللذيذ كالشخشوخة والكسكسي، وفرنا لك معالم تفاعلية دقيقة. يرجى تهيئة مفتاح GEMINI_API_KEY في لوحة الإعدادات للحصول على استجابات حية من الذكاء الاصطناعي!',
          fr: "L'Algérie possède un patrimoine exceptionnel. De la Casbah d'Alger aux oasis d'El Oued, le couscous et l'hospitalité légendaire vous attendent ! Pour des explications personnalisées d'intelligence artificielle, configurez GEMINI_API_KEY.",
          en: "Algeria is rich with stunning historical spots! The Casbah represents medieval Ottoman culture, Ghardaia presents desert architectural gems, and Constantine bridges inspire wonder. For real-time active AI responses, please set up the GEMINI_API_KEY secret in Settings."
        };

        const fallbackReply = fallbacks[language] || fallbacks['en'];

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-ai`,
            sender: 'ai',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setErrorMessage('Notice: Currently running under local offline fallback. Activate the live server keys for full dynamic guidance.');
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate travel itinerary calling the newly built /api/itinerary
  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setLoadingPhraseIndex(0);

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          budget: budgetStyle,
          interest: interestType,
          duration: tripDays,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('API failed to respond');
      }

      const data = await response.json();
      setItineraryResult(data);
    } catch (error: any) {
      console.error('Failed to contact server for itinerary:', error);
      setErrorMessage('Notice: Could not communicate with server. Real-time generation requires an active backend server connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Itinerary Text to Clipboard
  const handleCopyItinerary = () => {
    if (!itineraryResult) return;
    
    let text = `=== ${itineraryResult.title} ===\n\n`;
    text += `${itineraryResult.overview}\n\n`;
    text += `Trip Duration: ${tripDays} Days | Budget Style: ${budgetStyle.toUpperCase()}\n`;
    text += `Estimated Cost: ${itineraryResult.totalEstimatedCostDzd?.toLocaleString()} DZD\n\n`;
    text += `--- Day-by-Day Program ---\n\n`;

    itineraryResult.days.forEach((day: any) => {
      text += `[Day ${day.dayNumber}] ${day.title} (Location: ${day.locationName})\n`;
      text += `- Morning: ${day.morning}\n`;
      text += `- Afternoon: ${day.afternoon}\n`;
      text += `- Evening: ${day.evening}\n`;
      text += `- Cuisine To Try: ${day.cuisineRecommendation}\n`;
      text += `- Budget Tip: ${day.budgetTip}\n`;
      text += `- Daily Est. Cost: ${day.estimatedCostDzd?.toLocaleString()} DZD\n\n`;
    });

    text += `Shared via Rihla DZ Intelligent Companion App.`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Open operating system print prompt
  const handlePrint = () => {
    window.print();
  };

  // Feed itinerary prompt right back to Chat Tab
  const handleAskAboutItinerary = () => {
    if (!itineraryResult) return;
    setActiveTab('chat');
    const customPrompt = language === 'ar'
      ? `لقد ولدت برنامج الحافز لرحلة مدتها ${tripDays} أيام في الجزائر ذو اهتمام (${interestType}). يرجى توضيح أفضل خيارات التنقل واللوجستيات والمخاطر أو المستجدات الأمنية في محطاتها بالتفصيل؟`
      : language === 'fr'
      ? `J'ai généré un itinéraire de ${tripDays} jours axé sur (${interestType}). Peux-tu m'expliquer en détail les transports recommandés, la logistique et les meilleures gares routières pour ce trajet ?`
      : `I just generated a ${tripDays}-day itinerary focusing on (${interestType}). Can you please dive deep into the recommended transportation options, transit times, and train/taxi logistics for this exact route?`;
    
    setInputVal(customPrompt);
  };

  const getLabel = (key: keyof typeof plannerLabels) => {
    const translationSet = plannerLabels[key];
    const userLang = language as keyof typeof translationSet;
    return translationSet[userLang] || translationSet.en;
  };

  const interestOptions = [
    { id: 'culture', label: plannerLabels.interestCulture },
    { id: 'desert', label: plannerLabels.interestDesert },
    { id: 'history', label: plannerLabels.interestHistory },
    { id: 'culinary', label: plannerLabels.interestCulinary },
    { id: 'coastal', label: plannerLabels.interestCoastal }
  ];

  if (currentUser?.role === 'guest') {
    const guestLockTrans = {
      title: {
        en: '🔒 Limited Access',
        fr: '🔒 Accès Limité',
        ar: '🔒 دخول محدود',
        es: '🔒 Acceso Limitado'
      },
      desc: {
        en: 'Please create an account or sign in on RAHLA to unlock our intelligent AI Guide and plan customized itineraries!',
        fr: 'Veuillez créer un compte ou vous connecter sur RAHLA pour débloquer le guide IA intelligent et pouvoir planifier vos itinéraires sur mesure !',
        ar: 'يرجى إنشاء حساب أو تسجيل الدخول في رحلة لتفعيل دليل الذكاء الاصطناعي الذكي لتخطيط مسارات مخصصة لرحلتك!',
        es: '¡Cree una cuenta o inicie sesión en RAHLA para desbloquear la guía de IA inteligente y planificar itinerarios a su medida!'
      },
      info: {
        en: "ℹ️ Guest mode (limited access) allows you to explore Algeria's destinations on our 3D digital twin or the interactive map, but interactive AI features powered by Gemini 3.5 are reserved for authenticated members.",
        fr: "ℹ️ Le mode invité (accès limité) vous permet d'explorer les destinations d'Algérie sur l'échelle 3D ou via la carte interactive d'excellence, mais les fonctionnalités interactives assistées par l'IA de Gemini 3.5 sont réservées aux membres authentifiés.",
        ar: "ℹ️ يسمح لك وضع الزائر (الدخول المحدود) باستكشاف الوجهات في الجزائر عبر التوأم الرقمي ثلاثي الأبعاد أو الخريطة التفاعلية، ولكن الميزات التفاعلية الذكية القائمة على جيميناي 3.5 مخصصة فقط للأعضاء المسجلين.",
        es: "ℹ️ El modo de invitado (acceso limitado) le permite explorar los destinos de Argelia en 3D o en el mapa interactivo, pero las funciones interactivas de IA con Gemini 3.5 están reservadas para miembros registrados."
      },
      footer: {
        en: 'Creating an account takes less than a minute on the home screen.',
        fr: "Créer un compte vous prendra moins d'une minute sur l'écran d'accueil.",
        ar: 'إنشاء حساب يستغرق أقل من دقيقة واحدة على الشاشة الرئيسية.',
        es: 'Crear una cuenta toma menos de un minuto en la pantalla de inicio.'
      }
    };

    const curLang = (language === 'ar' || language === 'es' || language === 'fr' || language === 'en') ? language : 'en';

    return (
      <div className="py-12 max-w-xl mx-auto px-4 text-center animate-fade-in animate-duration-300" id="ai-companion-assistant">
        <div className="bg-white/95 dark:bg-[#151515]/95 border-2 border-amber-500/20 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 border border-[#d4af37] text-[#d4af37] rounded-full flex items-center justify-center mx-auto shadow-md">
            <Shield size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-slate-100 leading-snug">
              {guestLockTrans.title[curLang]}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-serif leading-relaxed">
              {guestLockTrans.desc[curLang]}
            </p>
          </div>
          <div className="p-4 bg-amber-500/5 rounded-2xl border border-[#d4af37]/15 text-xs text-left leading-relaxed text-slate-650 dark:text-slate-350 font-serif">
            {guestLockTrans.info[curLang]}
          </div>
          <p className="text-[10px] text-slate-400 italic">
            {guestLockTrans.footer[curLang]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4" id="ai-companion-assistant">
      
      {/* Profile Header */}
      <div className="text-center max-w-xl mx-auto mb-6 print:hidden">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold italic tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed] flex items-center justify-center space-x-2.5 space-x-reverse">
          <Sparkles className="text-[#d4af37] animate-pulse" size={24} />
          <span>{t('aiGuideTitle')}</span>
        </h1>
        <p className="mt-3 text-xs uppercase tracking-widest font-mono text-gray-550 dark:text-gray-400">
          {t('aiGuideSubtitle')}
        </p>
      </div>

      {/* Dynamic Tab Selector - Hidden on printed pages */}
      <div className="flex border border-[#1a1a1a]/15 dark:border-white/10 p-1 bg-[#eae7e1]/20 dark:bg-[#121212]/30 max-w-md mx-auto mb-8 print:hidden">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-[10.5px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#f5f2ed] dark:text-black font-semibold'
              : 'text-gray-500 hover:text-[#1a1a1a] dark:hover:text-white'
          }`}
        >
          {getLabel('tabChat')}
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex-1 py-1.5 text-[10.5px] font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#f5f2ed] dark:text-black font-semibold'
              : 'text-gray-500 hover:text-[#1a1a1a] dark:hover:text-white'
          }`}
        >
          {getLabel('tabPlanner')}
        </button>
      </div>

      {/* RENDER CHAT MODULE */}
      {activeTab === 'chat' && (
        <div className="bg-[#eae7e1]/20 dark:bg-[#161616]/45 border border-[#1a1a1a]/15 dark:border-white/10 rounded-none shadow-2xl flex flex-col h-[525px] overflow-hidden relative print:hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-xl pointer-events-none"></div>

          {/* Status alarm if error message is present */}
          {errorMessage && (
            <div className="bg-amber-500/10 border-b border-[#d4af37]/20 text-amber-700 dark:text-[#d4af37] px-4 py-2.5 text-[9px] uppercase tracking-widest font-mono flex items-center space-x-2 space-x-reverse z-10">
              <AlertCircle size={13} className="text-[#d4af37]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Chat Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((message) => {
              const isUser = message.sender === 'user';
              return (
                <div 
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start max-w-[85%] space-x-2.5 space-x-reverse`}>
                    
                    {!isUser && (
                      <div className="w-8 h-8 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-[#d4af37] dark:text-[#1a1a1a] border border-[#d4af37] flex items-center justify-center shrink-0">
                        <Sparkles size={13} />
                      </div>
                    )}

                    <div className={`p-4 rounded-none text-xs leading-relaxed ${
                      isUser 
                        ? 'bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#eae7e1] dark:text-black border border-[#d4af37] shadow-md font-sans' 
                        : 'bg-[#eae7e1]/70 dark:bg-[#202020]/90 dark:text-[#e2dfd9] border border-[#1a1a1a]/15 dark:border-white/10 shadow-xs font-serif italic'
                    }`}>
                      <div className="whitespace-pre-line leading-relaxed">{message.text}</div>
                      <span className={`block text-[8px] font-mono mt-1.5 w-full text-right ${isUser ? 'text-[#d4af37]' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 bg-transparent text-[#1a1a1a] dark:text-white shrink-0 border border-[#1a1a1a]/25 dark:border-white/20 flex items-center justify-center">
                        <User size={13} />
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2.5 space-x-reverse">
                  <div className="w-8 h-8 bg-[#1a1a1a] dark:bg-white flex items-center justify-center text-[#d4af37] dark:text-black shrink-0">
                    <Sparkles size={13} className="animate-spin" />
                  </div>
                  <div className="bg-[#eae7e1]/70 dark:bg-[#202020]/90 p-3.5 border border-[#1a1a1a]/15 dark:border-white/10 rounded-none flex items-center space-x-1.5 space-x-reverse">
                    <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Pills Section Footer */}
          {messages.length <= 2 && (
            <div className="px-4 pb-3 pt-2 flex overflow-x-auto space-x-2 space-x-reverse justify-start scrollbar-none border-t border-[#1a1a1a]/10 dark:border-white/10 pt-3 bg-black/5">
              {suggestionPills.map((pill, id) => {
                const label = pill[language as keyof typeof pill] || pill['en'];
                return (
                  <button
                    key={id}
                    onClick={() => handleSendMessage(label)}
                    className="px-3.5 py-1.5 whitespace-nowrap text-[9px] font-mono uppercase tracking-widest bg-transparent hover:bg-[#d4af37]/15 text-[#1a1a1a] dark:text-[#f5f2ed] border border-[#d4af37]/40 rounded-none transition-all cursor-pointer"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Chat input box */}
          <div className="p-4 border-t border-[#1a1a1a]/15 dark:border-white/10 bg-[#eae7e1]/50 dark:bg-[#121212]/30 flex items-center space-x-2 space-x-reverse">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={messages.length === 1 ? t('chatWithAI') : "Ask about traditional dishes, Sahara security, trains, or hotels..."}
              className="flex-1 text-xs border border-[#1a1a1a]/20 dark:border-white/15 dark:bg-black/40 rounded-none px-4 py-3 text-[#1a1a1a] dark:text-[#f5f2ed] placeholder-gray-500 focus:outline-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-3 bg-[#1a1a1a] dark:bg-[#f5f2ed] text-[#f5f2ed] dark:text-black hover:bg-[#d4af37] hover:text-black border border-[#d4af37] rounded-none shadow-md transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      {/* RENDER PLANNER MODULE */}
      {activeTab === 'planner' && (
        <div className="space-y-8">
          
          {/* Settings Grid Panel */}
          <div className="bg-[#eae7e1]/25 dark:bg-[#161616]/75 border border-[#1a1a1a]/15 dark:border-white/10 p-6 sm:p-8 rounded-none shadow-xl relative print:hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-lg pointer-events-none"></div>

            <div className="mb-6">
              <h2 className="text-xl font-serif font-bold italic tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed]">
                {getLabel('titlePlanner')}
              </h2>
              <p className="text-xs text-gray-550 dark:text-gray-400 mt-1.5 leading-relaxed">
                {getLabel('subtitlePlanner')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1a1a1a]/10 dark:border-white/10">
              
              {/* Left Column: Interest & Duration */}
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a] dark:text-[#eae7e1] mb-2.5 font-bold flex items-center gap-1.5">
                    <Compass size={12} className="text-[#d4af37]" />
                    <span>{getLabel('labelInterest')}</span>
                  </label>
                  <div className="space-y-2">
                    {interestOptions.map((opt) => {
                      const isActive = interestType === opt.id;
                      const localizedLabel = opt.label[language as keyof typeof opt.label] || opt.label.en;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setInterestType(opt.id)}
                          className={`w-full text-left p-3 text-xs flex items-center justify-between border transition cursor-pointer ${
                            isActive 
                              ? 'bg-[#1a1a1a] text-[#f5f2ed] border-[#d4af37] dark:bg-[#eae7e1] dark:text-black dark:border-[#d4af37]' 
                              : 'bg-transparent text-gray-700 dark:text-gray-300 border-[#1a1a1a]/10 dark:border-white/10 hover:border-[#d4af37]/50'
                          }`}
                        >
                          <span>{localizedLabel}</span>
                          {isActive && <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Picker */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a] dark:text-[#eae7e1] mb-3 font-bold flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#d4af37]" />
                    <span>{getLabel('labelDuration')}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 7, 10].map((d) => {
                      const isActive = tripDays === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setTripDays(d)}
                          className={`py-3 text-xs font-mono font-bold border transition duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-[#1a1a1a] text-[#f5f2ed] border-[#d4af37] dark:bg-[#eae7e1] dark:text-black dark:border-[#d4af37]'
                              : 'bg-transparent text-gray-700 dark:text-gray-300 border-[#1a1a1a]/10 dark:border-white/10 hover:border-[#d4af37]/45'
                          }`}
                        >
                          {d} {language === 'ar' ? 'أيام' : 'Days'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Budgets Selector Cards */}
              <div className="space-y-4">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1a1a1a] dark:text-[#eae7e1] mb-1 font-bold flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-[#d4af37]" />
                  <span>{getLabel('labelBudget')}</span>
                </label>

                {/* Budget Style Selector */}
                <div 
                  onClick={() => setBudgetStyle('economy')}
                  className={`p-4 border block text-left transition duration-200 cursor-pointer relative overflow-hidden ${
                    budgetStyle === 'economy' 
                      ? 'bg-[#1a1a1a]/5 dark:bg-white/5 border-[#d4af37] ring-1 ring-[#d4af37]' 
                      : 'bg-transparent border-[#1a1a1a]/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-[#d4af37]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold font-serif text-[#1a1a1a] dark:text-white">
                      💡 {getLabel('economyTitle')}
                    </h4>
                    <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
                      ~5,000 DZD / {language === 'ar' ? 'يوم' : 'day'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-gray-550 dark:text-gray-400 leading-relaxed font-sans mt-1">
                    {getLabel('economyDesc')}
                  </p>
                </div>

                <div 
                  onClick={() => setBudgetStyle('moderate')}
                  className={`p-4 border block text-left transition duration-200 cursor-pointer relative overflow-hidden ${
                    budgetStyle === 'moderate' 
                      ? 'bg-[#1a1a1a]/5 dark:bg-white/5 border-[#d4af37] ring-1 ring-[#d4af37]' 
                      : 'bg-transparent border-[#1a1a1a]/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-[#d4af37]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold font-serif text-[#1a1a1a] dark:text-white">
                      🛡️ {getLabel('moderateTitle')}
                    </h4>
                    <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
                      ~12,500 DZD / {language === 'ar' ? 'يوم' : 'day'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-gray-550 dark:text-gray-400 leading-relaxed font-sans mt-1">
                    {getLabel('moderateDesc')}
                  </p>
                </div>

                <div 
                  onClick={() => setBudgetStyle('luxury')}
                  className={`p-4 border block text-left transition duration-200 cursor-pointer relative overflow-hidden ${
                    budgetStyle === 'luxury' 
                      ? 'bg-[#1a1a1a]/5 dark:bg-white/5 border-[#d4af37] ring-1 ring-[#d4af37]' 
                      : 'bg-transparent border-[#1a1a1a]/10 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-[#d4af37]/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold font-serif text-[#1a1a1a] dark:text-white">
                      👑 {getLabel('luxuryTitle')}
                    </h4>
                    <span className="text-[10px] font-mono text-[#d4af37] font-semibold">
                      ~28,000 DZD / {language === 'ar' ? 'يوم' : 'day'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-gray-550 dark:text-gray-400 leading-relaxed font-sans mt-1">
                    {getLabel('luxuryDesc')}
                  </p>
                </div>
              </div>

            </div>

            {/* ERROR CATCH PANEL */}
            {errorMessage && (
              <div className="bg-amber-500/10 border border-[#d4af37]/25 text-amber-700 dark:text-[#d4af37] p-4 text-[10px] tracking-wider font-mono flex items-center space-x-2.5 mt-6 leading-relaxed">
                <AlertCircle size={15} className="text-[#d4af37] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* GENERATOR DISPATCH BUTTON */}
            <div className="mt-8 pt-4 border-t border-[#1a1a1a]/10 dark:border-white/10">
              <button
                onClick={handleGenerateItinerary}
                disabled={isGenerating}
                className="w-full py-4 bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#f5f2ed] dark:text-black hover:bg-[#d4af37] hover:text-black border border-[#d4af37] rounded-none font-serif text-sm tracking-widest uppercase transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    <span>{language === 'ar' ? 'جاري تفصيل البرنامج السياحي...' : 'Tailoring your itinerary...'}</span>
                  </>
                ) : (
                  <span>{getLabel('btnGenerate')}</span>
                )}
              </button>
            </div>

          </div>

          {/* DYNAMIC LOADER CARD */}
          {isGenerating && (
            <div className="bg-[#eae7e1]/20 dark:bg-black/40 border border-[#1a1a1a]/10 dark:border-white/10 p-12 text-center flex flex-col items-center justify-center space-y-5 print:hidden">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-[#d4af37]/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#d4af37] rounded-full animate-spin"></div>
                <Compass className="text-[#d4af37] animate-pulse" size={24} />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 font-bold mb-1.5 animate-pulse">
                  {language === 'ar' ? 'فريق رِحلة الذكي يتواصل مع الخبراء' : 'Rihla Intelligence Gathering'}
                </h4>
                <p className="text-sm font-serif italic text-slate-800 dark:text-[#f5f2ed] transition-all duration-300">
                  "{loadingPhrases[language as keyof typeof loadingPhrases]?.[loadingPhraseIndex] || loadingPhrases.en[loadingPhraseIndex]}"
                </p>
              </div>
            </div>
          )}

          {/* ITINERARY RESULTS CONTAINER */}
          {itineraryResult && !isGenerating && (
            <div className="space-y-6 animate-fade-in relative">
              
              {/* PRINT & ACTION HUD BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#eae7e1]/25 dark:bg-[#121212]/80 border border-[#1a1a1a]/10 dark:border-white/10 p-4 rounded-none print:hidden">
                <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5 font-bold">
                  <Shield size={12} className="animate-pulse" />
                  <span>{getLabel('actionsHeader')}</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyItinerary}
                    className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider bg-transparent border border-[#d4af37]/40 hover:bg-[#d4af37]/10 text-gray-700 dark:text-gray-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-500">{getLabel('copiedMsg')}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>{getLabel('btnCopy')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider bg-[#1a1a1a] text-white dark:bg-[#f5f2ed] dark:text-black border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer size={12} />
                    <span>{getLabel('btnPrint')}</span>
                  </button>
                </div>
              </div>

              {/* OUTWARD PRINT BLOCK (Saves/Prints beautifully with color scheme compliance) */}
              <div className="bg-[#fcfbf9] dark:bg-[#0c0c0c] border-2 border-[#d4af37]/40 p-6 sm:p-10 rounded-none shadow-2xl relative print:border-none print:p-0 print:shadow-none print:bg-white">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4af37]/3 rounded-full blur-2xl pointer-events-none print:hidden"></div>
                
                {/* Genuine Title Block */}
                <div className="border-b border-dashed border-[#1a1a1a]/15 dark:border-white/15 pb-6 text-center">
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#d4af37] uppercase block font-bold mb-1.5">
                    ✦ RIHLA DZ TRAVEL PROGRAMME ✦
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black italic tracking-tight text-[#1a1a1a] dark:text-[#f5f2ed] leading-tight max-w-2xl mx-auto print:text-black">
                    {itineraryResult.title}
                  </h1>
                  
                  {/* Summary row */}
                  <div className="flex flex-wrap justify-center gap-y-1 items-center gap-x-4 mt-4 text-[10px] font-mono text-gray-550 dark:text-gray-400 tracking-wider">
                    <span className="uppercase">Budget: <strong className="text-[#d4af37]">{budgetStyle}</strong></span>
                    <span className="w-1.5 h-1.5 bg-[#d4af37]/45 rounded-full"></span>
                    <span className="uppercase">Interest: <strong className="text-[#d4af37]">{interestType}</strong></span>
                    <span className="w-1.5 h-1.5 bg-[#d4af37]/45 rounded-full"></span>
                    <span className="uppercase">Days: <strong className="text-[#d4af37]">{tripDays} Nights & Days</strong></span>
                  </div>
                </div>

                {/* Poetic Overview Text */}
                <div className="my-6 text-xs sm:text-sm font-serif italic text-gray-750 dark:text-[#eae7e1] leading-relaxed text-center max-w-3xl mx-auto border-b border-dashed border-[#1a1a1a]/15 dark:border-white/15 pb-6 print:text-black">
                  "{itineraryResult.overview}"
                </div>

                {/* PROMINTENT TOTAL ESTIMATE ACCENT */}
                <div className="my-6 p-4 bg-[#eae7e1]/20 dark:bg-[#1a1a1a]/60 border border-[#d4af37]/25 flex flex-col sm:flex-row justify-between items-center gap-3 rounded-none print:bg-gray-100 print:text-black print:border-gray-300">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-550 dark:text-gray-400 font-bold flex items-center gap-1.5">
                    <Info size={13} className="text-[#d4af37]" />
                    <span>{getLabel('totalBudget')}</span>
                  </span>
                  <span className="text-lg font-mono font-bold tracking-tight text-[#d4af37] print:text-black">
                    {itineraryResult.totalEstimatedCostDzd ? itineraryResult.totalEstimatedCostDzd.toLocaleString() : '---'} DZD
                  </span>
                </div>

                {/* QUICK TIPS TOGGLE & PANEL */}
                <div className="my-6 border border-[#d4af37]/40 bg-[#eae7e1]/10 dark:bg-black/20 rounded-none overflow-hidden print:hidden">
                  <button
                    onClick={() => setShowQuickTips(!showQuickTips)}
                    type="button"
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition duration-150 hover:bg-[#d4af37]/5 cursor-pointer text-[#1a1a1a] dark:text-[#f5f2ed]"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Sparkles className="text-[#d4af37] animate-pulse" size={16} />
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest font-black">
                          {language === 'ar' ? '✦ كبسولة مرشد السلوك والعبارات المحلية ✦' : '✦ Cultural Etiquette & Local Phrasebook ✦'}
                        </h4>
                        <p className="text-[10px] text-gray-550 dark:text-gray-400 mt-1">
                          {language === 'ar'
                            ? 'انقر لتصفح آداب المجتمع وقاموس العبارات بالأمازيغية والدارجة المناسبة للمقصد'
                            : 'Explore regional cultural context, respectful etiquette, and authentic phrase translation.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#d4af37] font-mono tracking-widest uppercase font-bold">
                      {showQuickTips ? (language === 'ar' ? 'إغلاق [-]' : 'CLOSE [-]') : (language === 'ar' ? 'عرض [+]' : 'EXPAND [+]')}
                    </span>
                  </button>

                  {showQuickTips && (
                    <div className="border-t border-[#d4af37]/25 p-5 animate-fade-in bg-white dark:bg-[#121212]/80">
                      {/* Destination Selector pills */}
                      <div className="flex flex-wrap gap-2 pb-4 border-b border-[#1a1a1a]/10 dark:border-white/10 mb-5">
                        {itineraryDestinations.map((key) => {
                          const item = destinationTipsData[key] || destinationTipsData.general;
                          const localizedName = item.name[language as keyof typeof item.name] || item.name.en;
                          const isSelected = selectedTipDest === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedTipDest(key)}
                              className={`px-3 py-1.5 text-[9.5px] font-mono uppercase tracking-widest border transition duration-150 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1a1a1a] text-white border-[#d4af37] dark:bg-[#f5f2ed] dark:text-black'
                                  : 'bg-transparent text-gray-650 dark:text-gray-400 border-[#1a1a1a]/10 dark:border-white/10 hover:border-[#d4af37]/50'
                              }`}
                            >
                              {key === 'general' ? '🗺️' : '📍'} {localizedName}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tip Details Layout */}
                      {(() => {
                        const activeData = destinationTipsData[selectedTipDest] || destinationTipsData.general;
                        const etiquetteList = activeData.etiquette[language as keyof typeof activeData.etiquette] || activeData.etiquette.en;
                        return (
                          <div className="space-y-6">
                            {/* Cultural Etiquette list */}
                            <div>
                              <h5 className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#d4af37] mb-3 flex items-center gap-1.5">
                                <Shield size={12} />
                                <span>{language === 'ar' ? 'آداب السلوك والثقافة المحلية' : 'Respectful Cultural Etiquette'}</span>
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {etiquetteList.map((tip, idx) => (
                                  <div key={idx} className="p-3 bg-neutral-50 dark:bg-black/10 border border-neutral-150 dark:border-white/5 font-sans text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                                    <span className="text-[#d4af37] font-mono font-bold mr-1">{idx + 1}.</span> {tip}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Language Phrasebook translation block */}
                            <div>
                              <h5 className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-[#d4af37] mb-3 flex items-center gap-1.5">
                                <Sparkles size={12} />
                                <span>{language === 'ar' ? 'العبارات واللسان المحلي (الجزائرية والأمازيغية)' : 'Contextual Essential Phrasebook'}</span>
                              </h5>
                              <div className="overflow-x-auto border border-[#1a1a1a]/10 dark:border-white/10 rounded-sm">
                                <table className="w-full text-left font-mono text-[10.5px]">
                                  <thead>
                                    <tr className="bg-[#eae7e1]/70 dark:bg-[#1a1a1a] text-gray-550 border-b border-[#1a1a1a]/15 dark:border-white/10">
                                      <th className="p-2.5 text-[9px] uppercase tracking-wider">{language === 'ar' ? 'العبارة باللغة الحالية' : 'Phrase Meaning'}</th>
                                      <th className="p-2.5 text-[9px] uppercase tracking-wider">{language === 'ar' ? 'الدارجة الجزائرية' : 'Algerian Arabic (Darja)'}</th>
                                      <th className="p-2.5 text-[9px] uppercase tracking-wider">{language === 'ar' ? 'اللغة الأمازيغية (ⵜⴰⵎⴰⵣⵉⵖⵜ)' : 'Tamazight (Berber)'}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {activeData.phrases.map((ph, idx) => {
                                      const meaning = ph.label[language as keyof typeof ph.label] || ph.label.en;
                                      return (
                                        <tr key={idx} className="border-b last:border-0 border-[#1a1a1a]/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">
                                          {/* Meaning column */}
                                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200">
                                            {meaning}
                                          </td>
                                          {/* Arabic script + pronunciation column */}
                                          <td className="p-3">
                                            <div className="font-sans text-xs text-right md:text-left font-bold text-gray-900 dark:text-white" dir="rtl">
                                              {ph.arScript}
                                            </div>
                                            <div className="text-[9px] text-gray-550 italic mt-0.5">
                                              "{ph.arPhonetic}"
                                            </div>
                                          </td>
                                          {/* Tamazight Tifinagh + pronunciation column */}
                                          <td className="p-3">
                                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-450">
                                              {ph.tmScript}
                                            </div>
                                            <div className="text-[9px] text-gray-550 italic mt-0.5">
                                              "{ph.tmPhonetic}"
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* DAY-BY-DAY LIST */}
                <div className="space-y-8 mt-8">
                  {itineraryResult.days?.map((day: any) => (
                    <div 
                      key={day.dayNumber}
                      className="border border-[#1a1a1a]/10 dark:border-white/10 hover:border-[#d4af37]/35 bg-white/40 dark:bg-[#111]/30 p-5 sm:p-6 transition rounded-none relative print:bg-white print:border-gray-200"
                    >
                      {/* Day Pill Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1a1a1a]/10 dark:border-white/10 pb-3 mb-4">
                        <div className="flex items-center space-x-2.5 space-x-reverse">
                          <span className="px-2.5 py-1 text-[9px] font-mono font-extrabold uppercase tracking-widest bg-[#1a1a1a] text-[#f5f2ed] dark:bg-[#f5f2ed] dark:text-black border border-[#d4af37]">
                            {language === 'ar' ? 'اليوم' : 'Day'} {day.dayNumber}
                          </span>
                          <span className="text-xs font-serif font-black italic text-[#1a1a1a] dark:text-white print:text-black">
                            {day.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 font-medium flex items-center gap-1">
                          <MapPin size={11} className="text-[#d4af37]" />
                          <span>{day.locationName}</span>
                        </span>
                      </div>

                      {/* Time stack */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-gray-700 dark:text-[#d3cfc7] leading-relaxed">
                        
                        {/* Morning */}
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-[#d4af37] block">
                            {getLabel('morningTitle')}
                          </span>
                          <p className="font-serif italic text-slate-800 dark:text-slate-300 print:text-black">{day.morning}</p>
                        </div>

                        {/* Afternoon */}
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-[#d4af37] block">
                            {getLabel('afternoonTitle')}
                          </span>
                          <p className="font-serif italic text-slate-800 dark:text-slate-300 print:text-black">{day.afternoon}</p>
                        </div>

                        {/* Evening */}
                        <div className="space-y-1">
                          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-[#d4af37] block">
                            {getLabel('eveningTitle')}
                          </span>
                          <p className="font-serif italic text-slate-800 dark:text-slate-300 print:text-black">{day.evening}</p>
                        </div>

                      </div>

                      {/* Gastronomy badge */}
                      {day.cuisineRecommendation && (
                        <div className="mt-4 pt-3.5 border-t border-[#1a1a1a]/5 dark:border-white/5 flex items-start gap-2">
                          <span className="px-2 py-0.5 whitespace-nowrap text-[8.5px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">
                            {getLabel('cuisineBadge')}
                          </span>
                          <span className="text-[11px] text-gray-650 dark:text-gray-300 italic font-medium print:text-black">
                            {day.cuisineRecommendation}
                          </span>
                        </div>
                      )}

                      {/* Local wisdom budget tip */}
                      {day.budgetTip && (
                        <div className="mt-2 pt-2.5 flex items-start gap-2">
                          <span className="px-2 py-0.5 whitespace-nowrap text-[8.5px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                            {getLabel('budgetTipTitle')}
                          </span>
                          <span className="text-[10.5px] text-gray-550 dark:text-gray-400 leading-relaxed print:text-black font-sans">
                            {day.budgetTip}
                          </span>
                        </div>
                      )}

                      {/* Day estimation cost flag */}
                      <div className="mt-3 text-right">
                        <span className="text-[9px] font-mono text-gray-400 tracking-wider">
                          Est. Daily Cost: <strong className="text-gray-600 dark:text-gray-200">{day.estimatedCostDzd?.toLocaleString()} DZD</strong>
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="hidden print:block text-center mt-10 text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                  Generated on {new Date().toLocaleDateString()} — Thank you for travelling with Rihla DZ.
                </div>

              </div>

              {/* INTEGRATION TRIGGER: FEED PROMPT BACK TO CHAT TAB */}
              <div className="p-5 border border-dashed border-[#d4af37]/35 bg-[#d4af37]/5 rounded-none flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <div className="text-left">
                  <h4 className="text-xs font-serif font-black text-[#1a1a1a] dark:text-[#f5f2ed]">
                    {language === 'ar' ? 'هل لديك أسئلة عن النقل أو المواقع؟' : 'Have questions about hotels, checkpoints, or booking?'}
                  </h4>
                  <p className="text-[10.5px] text-gray-550 dark:text-gray-400 mt-1 font-sans">
                    {language === 'ar' 
                      ? 'يمكنك نقل هذا البرنامج فوراً لمرشدك السياحي لمناقشة ترتيبات النقل والتاكسيات والقطارات.'
                      : 'Transfer this itinerary into the Tour Guide chat right away to consult on bus hubs, airport taxis, or safety tips.'
                    }
                  </p>
                </div>
                <button
                  onClick={handleAskAboutItinerary}
                  className="px-4 py-2.5 whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1a1a1a] text-white dark:bg-[#f5f2ed] dark:text-black hover:bg-[#d4af37] hover:text-black border border-[#d4af37] transition cursor-pointer shrink-0"
                >
                  {getLabel('askGuide')} &rarr;
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
