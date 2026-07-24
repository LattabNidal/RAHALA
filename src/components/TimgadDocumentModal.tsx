import React, { useState } from 'react';
import { FileText, Download, X, Award, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Building2, ShieldCheck, Image as ImageIcon, MapPin, CheckCircle2, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StreetView360 } from './StreetView360';

const timgadFolderModules = import.meta.glob('/src/assets/images/Timgad Roman Ruins/*.{webp,jpg,JPG,jpeg,png,jfif,JFIF}', { eager: true, import: 'default' });
const timgadImagesList = Array.from(new Set(Object.values(timgadFolderModules) as string[])).filter(Boolean);

const primaryTimgadPhoto = timgadImagesList.find(img => img.includes('Trajan') || img.includes('Trajan') || img.includes('shutterstock'))
  || timgadImagesList[0]
  || '/src/assets/images/Timgad Roman Ruins/Ruins-Roman-City-Thamugadi-Timgad-Algeria-Trajan.webp';

export const timgadGalleryPhotos = [
  {
    id: 1,
    src: timgadImagesList.find(img => img.includes('Trajan')) || primaryTimgadPhoto,
    title: {
      fr: "Arc de Triomphe de Trajan (Porte de Lambèse)",
      ar: "قوس النصر لإمبراطور ترايان (بوابة لمبيز)",
      en: "Triumphal Arch of Trajan (Lambese Gate)",
      es: "Arco de Triunfo de Trajano (Puerta de Lambese)"
    },
    category: "Arc Monumental",
    desc: {
      fr: "Monument majestueux à trois baies construit en calcaire d'Aures marquant l'entrée ouest du Decumanus Maximus.",
      ar: "نصُب تذكاري مهيب بثلاث فتحات مبني من الحجر الجيري لأوراس يمثل المدخل الغربي للديكومانوس ماكسيموس.",
      en: "Majestic three-bay monument built in Aures limestone marking the western entrance of the Decumanus Maximus.",
      es: "Monumento majestuoso de tres arcos construido en caliza de Aurès que marca la entrada oeste del Decumanus Maximus."
    }
  },
  {
    id: 2,
    src: timgadImagesList.find(img => img.includes('shutterstock')) || primaryTimgadPhoto,
    title: {
      fr: "Vue Panoramique du Tracé en Damier (Castrum Romain)",
      ar: "منظر بانورامي للمخطط الشطرنجي (المعسكر الروماني)",
      en: "Panoramic View of the Grid Layout (Roman Castrum)",
      es: "Vista Panorámica del Trazado en Retícula (Castrum Romano)"
    },
    category: "Urbanisme",
    desc: {
      fr: "Exemple parfait d'urbanisme romain orthogonal créé ex nihilo en l'an 100 sous le règne de l'empereur Trajan.",
      ar: "نموذج مثالي للتخطيط العمراني الروماني المتعامد المنشأ من العدم عام 100 م في عهد ترايان.",
      en: "Perfect example of orthogonal Roman urban planning created ex nihilo in 100 AD under Emperor Trajan.",
      es: "Ejemplo perfecto de urbanismo romano ortogonal creado ex nihilo en el año 100 d.C. bajo el emperador Trajano."
    }
  },
  {
    id: 3,
    src: timgadImagesList.find(img => img.includes('timgad-un-site')) || primaryTimgadPhoto,
    title: {
      fr: "Théâtre Antique de Timgad (3 500 places)",
      ar: "المسرح الروماني القديم لتيمقاد (3500 مقعد)",
      en: "Ancient Theater of Timgad (3,500 seats)",
      es: "Teatro Antiguo de Timgad (3 500 plazas)"
    },
    category: "Édifice de Spectacle",
    desc: {
      fr: "Théâtre creusé dans le flanc de la colline offrant une acoustique remarquable sur la plaine des Aurès.",
      ar: "مسرح محفور في منحدر التلة يوفر هندسة صوتية ممتازة تطل على سهول الأوراس.",
      en: "Theater carved into the hillside offering remarkable acoustics overlooking the Aurès plain.",
      es: "Teatro excavado en la ladera de la colina que ofrece una acústica destacada sobre la llanura de Aurès."
    }
  },
  {
    id: 4,
    src: timgadImagesList.find(img => img.includes('abi336ejhvy51')) || primaryTimgadPhoto,
    title: {
      fr: "Decumanus Maximus & Colonnes du Forum",
      ar: "الديكومانوس ماكسيموس وأعمدة الفوروم",
      en: "Decumanus Maximus & Forum Columns",
      es: "Decumanus Maximus y Columnas del Foro"
    },
    category: "Architecture",
    desc: {
      fr: "Voie triomphale dalles de calcaire polies conservant les ornements corinthiens et les rainures des chars romains.",
      ar: "شارع النصر المبلط بالحجارة الكلسية مع الاحتفاظ بالزخارف الكورنثية وآثار عجلات العربات الرومانية.",
      en: "Triumphal street paved with polished limestone slabs preserving Corinthian ornaments and chariot wheel ruts.",
      es: "Calle triunfal pavimentada con losas de caliza pulida que conserva adornos corintios y marcas de carros romanos."
    }
  },
  {
    id: 5,
    src: timgadImagesList.find(img => img.includes('Algeria-_Timgad_1')) || primaryTimgadPhoto,
    title: {
      fr: "Capitole & Colonnes Flûtées du Temple",
      ar: "الكابيتول وأعمدة المعبد الحلزونية",
      en: "Capitoleum & Temple Fluted Columns",
      es: "Capitolio y Columnas Estriadas del Templo"
    },
    category: "Cultes & Temples",
    desc: {
      fr: "Sanctuaire colossal dédié à la triade capitoline (Jupiter, Junon, Minerve) dominant la partie sud de la cité.",
      ar: "معبد ضخم مخصص للثالوث الكابيتولي (جوبيتر، جونو، مينيرفا) يطل على الجزء الجنوبي من المدينة.",
      en: "Colossal sanctuary dedicated to the Capitoline Triad (Jupiter, Juno, Minerva) dominating the southern district.",
      es: "Santuario colosal dedicado a la Tríada Capitolina (Júpiter, Juno, Minerva) que domina la zona sur de la ciudad."
    }
  },
  {
    id: 6,
    src: timgadImagesList.find(img => img.includes('1536x864_cmsv2')) || primaryTimgadPhoto,
    title: {
      fr: "Thermes du Nord & Collection de Mosaïques",
      ar: "الحمامات الشمالية ومجموعة الفسيفساء",
      en: "North Baths & Mosaic Collection",
      es: "Termas del Norte y Colección de Mosaicos"
    },
    category: "Thermes & Musées",
    desc: {
      fr: "L'un des 14 complexes thermaux conservant des décors de mosaïques exposés au Musée de site de Timgad.",
      ar: "واحد من 14 حمامًا رومانيًا يحتفظ بديكورات فسيفسائية معروضة في متحف موقع تيمقاد.",
      en: "One of 14 thermal bath complexes preserving mosaic artworks on display at the Timgad Site Museum.",
      es: "Uno de los 14 complejos termales que conserva mosaicos expuestos en el Museo de Sitio de Timgad."
    }
  }
];

const contentTimgad = {
  fr: {
    fileName: "UNESCO_Rapport_Officiel_Timgad_Thamugadi.pdf",
    fileSubtitle: "Rapport Périodique Officiel UNESCO (1982 / N° 194) • République Algérienne",
    tabDoc: "Rapport Périodique UNESCO (Timgad N° 194)",
    tabPhotos: "Galerie Photographique & Arc de Trajan (6 Clichés)",
    tabTech: "Fiche Technique, Attributs & OGEBC",
    p1Title: "RAPPORT PÉRIODIQUE UNESCO - TIMGAD",
    p1Sub: "CONVENTION CONCERNANT LA PROTECTION DU PATRIMOINE MONDIAL, CULTUREL ET NATUREL",
    s1Title: "1. Données sur le Bien du Patrimoine Mondial",
    siteNameLabel: "Nom du bien :",
    siteNameVal: "Timgad (Colonia Marciana Traiana Thamugadi)",
    locLabel: "Localisation :",
    locVal: "Wilaya de Batna, Algérie 🇩🇿",
    coordLabel: "Coordonnées :",
    areaLabel: "Superficie :",
    areaVal: "90,54 ha (Zone tampon : En cours)",
    yearLabel: "Année d'inscription :",
    managerLabel: "Gestionnaire :",
    s3Title: "3. Déclaration de Valeur Universelle Exceptionnelle (VUE)",
    s3Synthesis: "« Dans un site montagneux d'une grande beauté, au nord du massif de l'Aurès, à 480 km au sud-est d'Alger et à 110 km au sud de Constantine, Timgad offre l'exemple achevé d'une colonie militaire romaine créée ex nihilo. La Colonia Marciana Traiana Thamugadi fut fondée en l'an 100 de notre ère par Trajan, probablement pour servir de campement à la 3ème Légion Auguste qui, par la suite, fut cantonnée à Lambèse. Le plan, d'une grande rigueur, illustre les principes de l'urbanisme romain à son apogée. »",
    hist1: "La croissance rapide de la cité aboutit, dès le milieu du IIe siècle, à faire éclater le cadre étroit de la fondation primitive. Timgad s'agrandit hors des remparts et des édifices publics majeurs sont construits dans les quartiers neufs : capitole, temples, marchés, thermes. La plupart datent de l'époque des Sévères, où la ville connut son âge d'or dont témoignent aussi d'immenses résidences privées.",
    hist2: "Les rues ont été pavées de grandes dalles rectangulaires en calcaire et un soin particulier a été apporté aux aménagements édilitaires, comme en témoignent les 14 thermes identifiés jusqu'à ce jour.",
    p2Title: "CRITÈRES D'INSCRIPTION ET ATTRIBUTS DE VALEUR UNIVERSELLE",
    crit2Title: "Critère (ii) : Échange d'Idées & Modèle Urbanistique",
    crit2Text: "Le site de Timgad, par son régime de camp militaire romain, son modèle urbanistique planifié et son type d'architecture civile et militaire particulier reflète un profond échange d'idées, de technologies et de traditions exercées par le pouvoir central de Rome sur la colonisation des hautes plaines de l'Algérie antique.",
    crit3Title: "Critère (iii) : Plan Orthogonal en Damier Remarquable",
    crit3Text: "Timgad reprend les préceptes de l'urbanisme planifié de la période romaine, régi par un remarquable plan orthogonal en damier. Timgad constitue ainsi un cas typique d'un modèle urbanistique dont la permanence du plan initial du castrum militaire a régi le développement du site.",
    crit4Title: "Critère (iv) : Riche Répertoire Architectural Diversifié",
    crit4Text: "Timgad recèle un riche répertoire architectural formé de typologies nombreuses et diversifiées : le système défensif, les édifices publics édilitaires et de spectacles (théâtre de 3 500 places), et un complexe épiscopal.",
    attrTitle: "Recensement Officiel des Attributs de la VUE (Section 3.2)",
    attr1: "• 3.2.1 Remarquable plan orthogonal en damier (Cardo/Decumanus)",
    attr2: "• 3.2.2 Riche répertoire architectural (Arc de Trajan, Capitole, Théâtre)",
    attr3: "• 3.2.3 Image vivante de la colonisation romaine en Afrique du Nord",
    attr4: "• 3.2.4 Somptueux décors de mosaïques romaines",
    attr5: "• 3.2.7 Grands édifices (14 Thermes, Bibliothèque de Rogatianus)",
    preserved: "Préservé ✓",
    p3Title: "PROTECTION, GESTION & BONNES PRATIQUES (SECTIONS 5 & 14)",
    lawsHead: "MESURES DE PROTECTION JURIDIQUE :",
    law1: "• Loi n° 90/30 du 01/12/1990 portant loi domaniale.",
    law2: "• Loi n° 98/04 du 15/06/1998 relative à la protection du patrimoine culturel.",
    law3: "• Décrets exécutifs n° 03/322 et 03/323 (Plan de Protection et de Mise en Valeur - PPMVSA).",
    bpHead: "Exemple de Bonne Pratique de Protection (Section 14.1 du Rapport) :",
    bpText: "« Transfert du Festival culturel de Timgad depuis le site archéologique vers un théâtre nouvellement réalisé, situé dans les abords du site, en vue de préserver le bien du patrimoine mondial. Édification de la clôture entourant le site (environ 5 km) délimitant précisément le site et le protégeant contre le pâturage illicite. Installation d'un système de surveillance électronique et renforcement du gardiennage OGEBC. »",
    statsVis: "Fréquentation Annuelle :",
    statsVisVal: "~100 000 visiteurs nationaux / ~2 500 internationaux",
    statsDur: "Durée Moyenne de Visite :",
    statsDurVal: "Entre 1 et 3 heures",
    stamp: "✓ RAPPORT CORRIGÉ ET CERTIFIÉ\nPATRIMOINE MONDIAL UNESCO N° 194",
    downloadBtn: "Télécharger Rapport",
    pageOf: "Page",
    of: "de"
  },
  ar: {
    fileName: "تقرير_اليونسكو_الرسمي_تيمقاد_تاموقادي.pdf",
    fileSubtitle: "التقرير الدوري الرسمي لليونسكو (1982 / رقم 194) • الجمهورية الجزائرية",
    tabDoc: "تقرير اليونسكو الدوري (تيمقاد رقم 194)",
    tabPhotos: "معرض الصور وقوس ترايان (6 صور)",
    tabTech: "البطاقة التقنية ومعالم OGEBC",
    p1Title: "التقرير الدوري لليونسكو - تيمقاد",
    p1Sub: "اتفاقية حماية التراث العالمي، الثقافي والطبيعي",
    s1Title: "1. بيانات عن ممتلك التراث العالمي",
    siteNameLabel: "اسم الموقع:",
    siteNameVal: "تيمقاد (كولونيا ماركيانا ترايانا تاموقادي)",
    locLabel: "الموقع:",
    locVal: "ولاية باتنة، الجزائر 🇩🇿",
    coordLabel: "الإحداثيات:",
    areaLabel: "المساحة:",
    areaVal: "90,54 هكتار (المنطقة المؤطرة: قيد التحديد)",
    yearLabel: "سنة التسجيل:",
    managerLabel: "الهيئة المسيرة:",
    s3Title: "3. بيان القيمة العالمية الاستثنائية (VUE)",
    s3Synthesis: "«في موقع جبلي شديد الجمال، شمال الأوراس، على بعد 480 كم جنوب شرق الجزائر العاصمة و110 كم جنوب قسنطينة، تقدم تيمقاد نموذجًا مكتملًا لمستعمرة عسكرية رومانية أنشئت من العدم. تأسست عام 100 م على يد الإمبراطور ترايان لتكون معسكرًا للفيالق العسكرية الرومانية. يعكس مخططها الدقيق أرقى مبادئ العمران الروماني.»",
    hist1: "أدى النمو السريع للمدينة منذ منتصف القرن الثاني الميلادي إلى التوسع خارج الأسوار وبناء منشآت عمومية كبرى في الأحياء الجديدة: الكابيتول، المعابد، الأسواق، و14 حمامًا رومانيًا. ويعود معظمها إلى العصر السيفيري الذي شهد العصر الذهبي للمدينة.",
    hist2: "تمت رصف الشوارع ببلاطات حجرية كلسية كبيرة مع عناية خاصة بالتجهيزات العمرانية والديكورات الفسيفسائية الفاخرة.",
    p2Title: "معايير التسجيل ومعالم القيمة العالمية الاستثنائية",
    crit2Title: "المعيار (ii) : تبادل الأفكار والنموذج العمراني",
    crit2Text: "يعكس موقع تيمقاد بفضل نظامه العسكري والتخطيط العمراني المحكم تبادلاً عميقاً للأفكار والتقنيات والهندسة المعمارية بين سلطة روما المركزية والمناطق النوميدية.",
    crit3Title: "المعيار (iii) : مخطط الشطرنج الأورثوغونالي الاستثنائي",
    crit3Text: "تستعيد تيمقاد مبادئ التخطيط العمراني الروماني القائم على شبكة الشطرنج المتعامدة (الكاردو والديكومانوس) كنموذج استثنائي وفريد في شمال إفريقيا.",
    crit4Title: "المعيار (iv) : السجل المعماري الغني والمتنوع",
    crit4Text: "تضم تيمقاد سجلاً معمارياً غنياً ومتنوعاً يشمل المنشآت الدفاعية، المباني العامة، المسرح Antique (3500 مقعد)، والحي الأسقفي.",
    attrTitle: "الإحصاء الرسمي لمعالم القيمة العالمية الاستثنائية (القسم 3.2)",
    attr1: "• 3.2.1 المخطط المتعامد الاستثنائي (الكاردو والديكومانوس)",
    attr2: "• 3.2.2 السجل المعماري الغني (قوس ترايان، الكابيتول، المسرح)",
    attr3: "• 3.2.3 صورة حية للاستيطان الروماني في شمال إفريقيا",
    attr4: "• 3.2.4 ديكورات الفسيفساء الرومانية الفاخرة",
    attr5: "• 3.2.7 المباني الضخمة (14 حمامًا، مكتبة روغاتيانوس)",
    preserved: "محفوظ ✓",
    p3Title: "الحماية والإدارة والممارسات الحسنة (القسمين 5 و14)",
    lawsHead: "تدابير الحماية القانونية:",
    law1: "• القانون رقم 90/30 المؤرخ في 1990/12/01 المتعلق بأملاك الدولة.",
    law2: "• القانون رقم 98/04 المؤرخ في 1998/06/15 المتعلق بحماية التراث الثقافي.",
    law3: "• المرسومان التنفيذيان رقم 03/322 و03/323 (مخطط حماية واستصلاح المواقع الأثرية PPMVSA).",
    bpHead: "نموذج الممارسات الحسنة للحماية (القسم 14.1 من التقرير):",
    bpText: "«تحويل المهرجان الثقافي لتيمقاد من الموقع الأثري إلى مسرح جديد تم إنشاؤه في محيط الموقع لحماية التراث العالمي. إنشاء سياج أمني بطول 5 كم لحماية الموقع من الرعي غير الشرعي والاعتداءات، وتركيب نظام مراقبة إلكتروني وتدعيم الحراسة.»",
    statsVis: "عدد الزوار السنوي:",
    statsVisVal: "~100,000 زائر محلي / ~2,500 زائر دولي",
    statsDur: "متوسط مدة الزيارة:",
    statsDurVal: "بين ساعة و3 ساعات",
    stamp: "✓ تقرير مصحح ومعتمد\nالتراث العالمي لليونسكو رقم 194",
    downloadBtn: "تحميل التقرير",
    pageOf: "صفحة",
    of: "من"
  },
  en: {
    fileName: "UNESCO_Official_Report_Timgad_Thamugadi.pdf",
    fileSubtitle: "Official UNESCO Periodic Report (1982 / N° 194) • People's Democratic Republic of Algeria",
    tabDoc: "UNESCO Periodic Report (Timgad N° 194)",
    tabPhotos: "Photo Gallery & Arch of Trajan (6 Photos)",
    tabTech: "Technical Sheet, Attributes & OGEBC",
    p1Title: "UNESCO PERIODIC REPORT - TIMGAD",
    p1Sub: "CONVENTION CONCERNING THE PROTECTION OF THE WORLD CULTURAL AND NATURAL HERITAGE",
    s1Title: "1. World Heritage Property Data",
    siteNameLabel: "Property Name:",
    siteNameVal: "Timgad (Colonia Marciana Traiana Thamugadi)",
    locLabel: "Location:",
    locVal: "Batna Province, Algeria 🇩🇿",
    coordLabel: "Coordinates:",
    areaLabel: "Area:",
    areaVal: "90.54 ha (Buffer zone: In progress)",
    yearLabel: "Inscription Year:",
    managerLabel: "Management Body:",
    s3Title: "3. Statement of Outstanding Universal Value (OUV)",
    s3Synthesis: "“In a mountainous site of great beauty, north of the Aurès massif, 480 km southeast of Algiers and 110 km south of Constantine, Timgad offers the complete example of a Roman military colony created ex nihilo. Colonia Marciana Traiana Thamugadi was founded in 100 AD by Trajan to serve as an encampment for the 3rd Augustan Legion. The strictly organized grid plan illustrates Roman urbanism at its peak.”",
    hist1: "The rapid growth of the city from the mid-2nd century caused it to expand beyond the initial castrum layout, constructing major public buildings in new quarters: Capitoleum, temples, markets, and 14 thermal baths, mostly dating from the Severan era.",
    hist2: "Streets were paved with large rectangular limestone slabs with meticulous municipal planning and elaborate mosaic decorations.",
    p2Title: "INSCRIPTION CRITERIA & OUV ATTRIBUTES",
    crit2Title: "Criterion (ii) : Human Values Exchange & Urban Planning Model",
    crit2Text: "The site of Timgad reflects a profound exchange of ideas, technologies, and military/civil architectural traditions exercised by Rome across the high plains of ancient Algeria.",
    crit3Title: "Criterion (iii) : Outstanding Orthogonal Grid Layout",
    crit3Text: "Timgad embodies planned Roman urbanism governed by a remarkable orthogonal grid plan (Cardo and Decumanus Maximus).",
    crit4Title: "Criterion (iv) : Rich & Diversified Architectural Repertoire",
    crit4Text: "Timgad conceals a rich architectural repertoire including defensive structures, public & entertainment buildings (3,500-seat theater), and an episcopal complex.",
    attrTitle: "Official Inventory of OUV Attributes (Section 3.2)",
    attr1: "• 3.2.1 Remarkable orthogonal grid plan (Cardo/Decumanus)",
    attr2: "• 3.2.2 Rich architectural repertoire (Trajan Arch, Capitoleum, Theater)",
    attr3: "• 3.2.3 Living image of Roman colonization in North Africa",
    attr4: "• 3.2.4 Sumptuous Roman mosaic decorations",
    attr5: "• 3.2.7 Colossal monuments (14 Thermal Baths, Rogatianus Library)",
    preserved: "Preserved ✓",
    p3Title: "PROTECTION, MANAGEMENT & GOOD PRACTICES (SECTIONS 5 & 14)",
    lawsHead: "LEGAL PROTECTION MEASURES:",
    law1: "• Law N° 90/30 of 12/01/1990 on public land.",
    law2: "• Law N° 98/04 of 06/15/1998 on cultural heritage protection.",
    law3: "• Executive Decrees N° 03/322 and 03/323 (Protection & Enhancement Plan - PPMVSA).",
    bpHead: "Good Conservation Practice Example (Section 14.1 of Report):",
    bpText: "“Relocation of the Timgad Cultural Festival from the ancient site to a newly constructed theater nearby to protect World Heritage monuments. Erection of a 5 km perimeter fence against illegal grazing, alongside electronic surveillance installation and reinforced OGEBC guarding.”",
    statsVis: "Annual Visitor Count:",
    statsVisVal: "~100,000 national visitors / ~2,500 international",
    statsDur: "Average Visit Duration:",
    statsDurVal: "Between 1 and 3 hours",
    stamp: "✓ CORRECTED & CERTIFIED REPORT\nUNESCO WORLD HERITAGE N° 194",
    downloadBtn: "Download Report",
    pageOf: "Page",
    of: "of"
  },
  es: {
    fileName: "UNESCO_Informe_Oficial_Timgad_Thamugadi.pdf",
    fileSubtitle: "Informe Periódico Oficial de la UNESCO (1982 / N° 194) • República Argelina",
    tabDoc: "Informe Periódico UNESCO (Timgad N° 194)",
    tabPhotos: "Galería de Fotos y Arco de Trajano (6 Fotos)",
    tabTech: "Ficha Técnica, Atributos y OGEBC",
    p1Title: "INFORME PERIÓDICO UNESCO - TIMGAD",
    p1Sub: "CONVENCIÓN SOBRE LA PROTECCIÓN DEL PATRIMONIO MUNDIAL, CULTURAL Y NATURAL",
    s1Title: "1. Datos del Bien del Patrimonio Mundial",
    siteNameLabel: "Nombre del bien:",
    siteNameVal: "Timgad (Colonia Marciana Traiana Thamugadi)",
    locLabel: "Ubicación:",
    locVal: "Provincia de Batna, Argelia 🇩🇿",
    coordLabel: "Coordenadas:",
    areaLabel: "Superficie:",
    areaVal: "90,54 ha (Zona de amortiguamiento: En proceso)",
    yearLabel: "Año de inscripción:",
    managerLabel: "Organismo gestor:",
    s3Title: "3. Declaración de Valor Universal Excepcional (VUE)",
    s3Synthesis: "«En un sitio montañoso de gran belleza, al norte del macizo de Aurès, a 480 km al sureste de Argel, Timgad ofrece el ejemplo perfecto de una colonia militar romana creada ex nihilo. La Colonia Marciana Traiana Thamugadi fue fundada en el año 100 d.C. por Trajano. Su plano ortogonal ilustra el urbanismo romano en su apogeo.»",
    hist1: "El rápido crecimiento de la ciudad desde mediados del siglo II provocó su expansión más allá del castrum inicial, construyendo grandes edificios públicos: capitolio, templos, mercados y 14 termas romanas.",
    hist2: "Las calles estaban pavimentadas con grandes losas de caliza rectangular con un riguroso planeamiento urbano y magníficos mosaicos.",
    p2Title: "CRITERIOS DE INSCRIPCIÓN Y ATRIBUTOS DE VUE",
    crit2Title: "Criterio (ii) : Intercambio de Valores Modelo Urbanístico",
    crit2Text: "El sitio de Timgad refleja un profundo intercambio de ideas y tecnologías ejercidas por la Roma central en el norte de África.",
    crit3Title: "Criterio (iii) : Destacado Plano Ortogonal en Retícula",
    crit3Text: "Timgad encarna el urbanismo romano planificado gobernado por un notable plano en retícula (Cardo y Decumanus Maximus).",
    crit4Title: "Criterio (iv) : Rico y Diversificado Repertorio Arquitectónico",
    crit4Text: "Timgad alberga un rico repertorio arquitectónico con fortificaciones, edificios públicos y de espectáculos (teatro de 3 500 plazas) y complejo episcopal.",
    attrTitle: "Inventario Oficial de Atributos del VUE (Sección 3.2)",
    attr1: "• 3.2.1 Destacado plano ortogonal en retícula (Cardo/Decumanus)",
    attr2: "• 3.2.2 Rico repertorio arquitectónico (Arco de Trajano, Capitolio, Teatro)",
    attr3: "• 3.2.3 Imagen viva de la colonización romana en el Norte de África",
    attr4: "• 3.2.4 suntuosos mosaicos romanos",
    attr5: "• 3.2.7 Grandes monumentos (14 Termas, Biblioteca de Rogatianus)",
    preserved: "Preservado ✓",
    p3Title: "PROTECCIÓN, GESTIÓN Y BUENAS PRÁCTICAS (SECCIONES 5 Y 14)",
    lawsHead: "MEDIDAS DE PROTECCIÓN LEGAL:",
    law1: "• Ley N° 90/30 de 01/12/1990 sobre dominio público.",
    law2: "• Ley N° 98/04 de 15/06/1998 sobre protección del patrimonio cultural.",
    law3: "• Decretos ejecutivos N° 03/322 y 03/323 (Plan de Protección - PPMVSA).",
    bpHead: "Ejemplo de Buena Práctica de Conservación (Sección 14.1 del Informe):",
    bpText: "«Traslado del Festival Cultural de Timgad fuera del sitio arqueológico a un nuevo teatro cercano para proteger los monumentos antiguos. Construcción de una valla perimetral de 5 km contra el pastoreo ilegal, junto con vigilancia electrónica y patrullaje reforzado del OGEBC.»",
    statsVis: "Visitantes Anuales:",
    statsVisVal: "~100 000 visitantes nacionales / ~2 500 internacionales",
    statsDur: "Duración Media de la Visita:",
    statsDurVal: "Entre 1 y 3 horas",
    stamp: "✓ INFORME CORREGIDO Y CERTIFICADO\nPATRIMONIO MUNDIAL UNESCO N° 194",
    downloadBtn: "Descargar Informe",
    pageOf: "Página",
    of: "de"
  }
};

interface TimgadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
  mapsApiKey: string;
}

export const TimgadDocumentModal: React.FC<TimgadDocumentModalProps> = ({
  isOpen,
  onClose,
  siteName = "Timgad (Colonia Marciana Traiana Thamugadi)",
  mapsApiKey
}) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'document' | 'photos' | 'technical' | '360'>('document');
  const [activeLightbox, setActiveLightbox] = useState<typeof timgadGalleryPhotos[0] | null>(null);

  if (!isOpen) return null;

  const t = contentTimgad[language as keyof typeof contentTimgad] || contentTimgad.fr;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `======================================================================\n` +
      `UNESCO WORLD HERITAGE - PERIODIC REPORT - TIMGAD\n` +
      `======================================================================\n\n` +
      `PROPERTY : ${t.siteNameVal}\n` +
      `LOCATION : ${t.locVal}\n` +
      `COORDINATES : 35.484 N / 6.469 E\n` +
      `INSCRIPTION YEAR : 1982 (CRITERIA ii, iii, iv)\n` +
      `AREA : ${t.areaVal}\n\n` +
      `--- 1. STATEMENT OF OUTSTANDING UNIVERSAL VALUE ---\n\n` +
      `${t.s3Synthesis}\n\n` +
      `${t.hist1}\n\n` +
      `--- 2. ATTRIBUTES ---\n\n` +
      `${t.attr1}\n${t.attr2}\n${t.attr3}\n${t.attr4}\n${t.attr5}\n\n` +
      `--- 3. GOOD CONSERVATION PRACTICE ---\n\n` +
      `${t.bpText}\n\n` +
      `${t.stamp}`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${t.fileName.replace('.pdf', '')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-[#1e1e1e] text-slate-100 border border-amber-500/40 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Document Header Toolbar */}
        <div className="bg-[#2a2a2a] border-b border-white/10 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 space-x-reverse min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              <Award size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="font-mono font-bold text-amber-400 text-xs sm:text-sm truncate">
                {t.fileName}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {t.fileSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation & Language Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
            
            {/* Language Switcher Pills */}
            <div className="flex items-center bg-black/50 rounded-lg p-1 border border-amber-500/30 font-mono text-[10px] space-x-1 space-x-reverse">
              {(['fr', 'ar', 'en', 'es'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded font-bold uppercase transition cursor-pointer ${
                    language === lang 
                      ? 'bg-amber-500 text-black shadow-xs' 
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Language: ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10 font-mono text-[11px]">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                title="Page précédente"
              >
                <ChevronLeft size={14} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <span className="px-2 text-amber-300 font-bold">
                {currentPage} / 3
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
                disabled={currentPage === 3}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                title="Page suivante"
              >
                <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>

            <div className="hidden md:flex items-center bg-black/40 rounded-lg p-1 border border-white/10 font-mono text-[11px]">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                className="p-1 hover:bg-white/10 rounded cursor-pointer"
                title="Zoom arrière"
              >
                <ZoomOut size={14} />
              </button>
              <span className="px-2 text-slate-300">
                {zoomLevel}%
              </span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 25))}
                className="p-1 hover:bg-white/10 rounded cursor-pointer"
                title="Zoom avant"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 space-x-reverse text-xs transition cursor-pointer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">{t.downloadBtn}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              title="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-[#242424] border-b border-white/5 px-4 py-2 flex space-x-2 space-x-reverse text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 space-x-reverse whitespace-nowrap ${
              activeTab === 'document' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>{t.tabDoc}</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 space-x-reverse whitespace-nowrap ${
              activeTab === 'photos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon size={13} />
            <span>{t.tabPhotos}</span>
          </button>

          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 space-x-reverse whitespace-nowrap ${
              activeTab === 'technical' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={13} />
            <span>{t.tabTech}</span>
          </button>

          <button
            onClick={() => setActiveTab('360')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 space-x-reverse whitespace-nowrap ${
              activeTab === '360' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>{language === 'ar' ? 'عرض 360°' : '360° View'}</span>
          </button>
        </div>

        {/* Modal View Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#121212] flex justify-center">

          {/* TAB 360 VIEW */}
          {activeTab === '360' && (
            <div className="w-full max-w-4xl animate-fade-in">
              <StreetView360
                title="Timgad - Arc de Trajan"
                panoId="CIHM0ogKEICAgMCYiufAoQE"
                lat={35.4873375}
                lng={6.4677031}
                heading={110.5}
                pitch={-41.5}
                fov={75}
                apiKey={mapsApiKey}
              />
            </div>
          )}
          
          {/* TAB 1: PDF DOCUMENT REPORT */}
          {activeTab === 'document' && (
            <div 
              className="bg-[#fcfbf9] text-gray-900 shadow-2xl border border-gray-300 p-6 sm:p-12 max-w-3xl w-full min-h-[850px] font-serif transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* PAGE 1 CONTENT */}
              {currentPage === 1 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  {/* Official UNESCO Stamp & Header */}
                  <div className="border-b-2 border-gray-900 pb-4 flex justify-between items-start">
                    <div>
                      <h1 className="text-base sm:text-xl font-bold uppercase tracking-widest text-gray-900">
                        {t.p1Title}
                      </h1>
                      <p className="text-xs font-sans font-bold text-amber-800 uppercase tracking-wider mt-0.5">
                        {t.p1Sub}
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs border-2 border-gray-900 p-2 font-bold bg-amber-50/50 shrink-0">
                      N° 1982 / 194
                    </div>
                  </div>

                  {/* Identification Box */}
                  <div className="bg-amber-50/40 border border-amber-200 p-4 font-sans text-xs space-y-2">
                    <h2 className="font-bold font-serif text-sm border-b border-amber-200 pb-1 text-amber-900 uppercase">
                      {t.s1Title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                      <div><strong className="text-gray-900">{t.siteNameLabel}</strong> {t.siteNameVal}</div>
                      <div><strong className="text-gray-900">{t.locLabel}</strong> {t.locVal}</div>
                      <div><strong className="text-gray-900">{t.coordLabel}</strong> 35.484 N / 6.469 E</div>
                      <div><strong className="text-gray-900">{t.areaLabel}</strong> {t.areaVal}</div>
                      <div><strong className="text-gray-900">{t.yearLabel}</strong> 1982</div>
                      <div><strong className="text-gray-900">{t.managerLabel}</strong> OGEBC (http://ogebc.com/)</div>
                    </div>
                  </div>

                  {/* Primary Featured Photo */}
                  <div className="my-4 border border-gray-300 p-2 bg-white rounded shadow-sm">
                    <img 
                      src={primaryTimgadPhoto} 
                      alt="Arc de Trajan et ruines romaines de Timgad" 
                      className="w-full h-64 object-cover rounded"
                    />
                    <p className="text-[10px] font-sans text-gray-500 italic mt-1.5 text-center">
                      UNESCO N° 194 — {t.siteNameVal}
                    </p>
                  </div>

                  {/* Brève Synthèse VUE */}
                  <div>
                    <h2 className="font-bold font-sans text-sm text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                      {t.s3Title}
                    </h2>
                    <p className="text-justify italic text-gray-800 leading-relaxed bg-amber-50/30 p-3 border-l-4 border-amber-600">
                      {t.s3Synthesis}
                    </p>
                  </div>

                  {/* Description Historique */}
                  <div className="space-y-3 text-gray-800 font-sans text-xs">
                    <p className="text-justify">{t.hist1}</p>
                    <p className="text-justify">{t.hist2}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Timgad (N° 194)</span>
                    <span>{t.pageOf} 1 {t.of} 3</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b border-gray-400 pb-2">
                    <h2 className="font-bold font-sans text-base text-gray-900 uppercase">
                      {t.p2Title}
                    </h2>
                  </div>

                  {/* Critères UNESCO */}
                  <div className="space-y-3 font-sans text-xs">
                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">{t.crit2Title}</h3>
                      <p className="text-gray-800 text-justify">{t.crit2Text}</p>
                    </div>

                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">{t.crit3Title}</h3>
                      <p className="text-gray-800 text-justify">{t.crit3Text}</p>
                    </div>

                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">{t.crit4Title}</h3>
                      <p className="text-gray-800 text-justify">{t.crit4Text}</p>
                    </div>
                  </div>

                  {/* Tableau des Attributs */}
                  <div className="bg-amber-50/50 p-3 border border-amber-200 font-sans text-xs space-y-2">
                    <h3 className="font-bold font-serif text-sm text-amber-900 border-b border-amber-200 pb-1 uppercase">
                      {t.attrTitle}
                    </h3>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center bg-white/80 p-1.5 rounded border border-amber-200">
                        <span>{t.attr1}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{t.preserved}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/80 p-1.5 rounded border border-amber-200">
                        <span>{t.attr2}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{t.preserved}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/80 p-1.5 rounded border border-amber-200">
                        <span>{t.attr3}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{t.preserved}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/80 p-1.5 rounded border border-amber-200">
                        <span>{t.attr4}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{t.preserved}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/80 p-1.5 rounded border border-amber-200">
                        <span>{t.attr5}</span>
                        <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{t.preserved}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Timgad (N° 194)</span>
                    <span>{t.pageOf} 2 {t.of} 3</span>
                  </div>
                </div>
              )}

              {/* PAGE 3 CONTENT */}
              {currentPage === 3 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2 flex justify-between items-center">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      {t.p3Title}
                    </h2>
                    <span className="font-mono text-[10px] bg-gray-200 px-2 py-0.5 rounded">OGEBC</span>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <div className="p-3 bg-gray-100 border border-gray-300 font-mono text-[11px] leading-relaxed">
                      <p><strong>{t.lawsHead}</strong></p>
                      <p>{t.law1}</p>
                      <p>{t.law2}</p>
                      <p>{t.law3}</p>
                    </div>

                    <div className="bg-amber-50/60 p-3 border-l-4 border-amber-700">
                      <h3 className="font-bold text-gray-900 mb-1 uppercase text-xs">
                        {t.bpHead}
                      </h3>
                      <p className="text-justify leading-relaxed">{t.bpText}</p>
                    </div>

                    <div className="border-t border-gray-300 pt-3 grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                        <strong className="text-gray-900 block">{t.statsVis}</strong>
                        <span>{t.statsVisVal}</span>
                      </div>
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                        <strong className="text-gray-900 block">{t.statsDur}</strong>
                        <span>{t.statsDurVal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp Seal */}
                  <div className="pt-6 flex justify-end">
                    <div className="border-2 border-amber-800 text-amber-900 p-3 font-mono text-[10px] text-center uppercase tracking-widest rounded bg-amber-50 whitespace-pre-line">
                      {t.stamp}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Timgad (N° 194)</span>
                    <span>{t.pageOf} 3 {t.of} 3</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === 'photos' && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10">
                <h3 className="text-amber-400 font-bold font-serif text-sm mb-1">
                  {t.tabPhotos}
                </h3>
                <p className="text-slate-400 text-xs">
                  {t.siteNameVal}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {timgadGalleryPhotos.map((photo) => {
                  const localizedTitle = photo.title[language as keyof typeof photo.title] || photo.title.fr;
                  const localizedDesc = photo.desc[language as keyof typeof photo.desc] || photo.desc.fr;
                  return (
                    <div 
                      key={photo.id} 
                      onClick={() => setActiveLightbox(photo)}
                      className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition duration-200 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative h-48 overflow-hidden bg-black">
                        <img 
                          src={photo.src} 
                          alt={localizedTitle} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-black/70 text-amber-400 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/30">
                          {photo.category}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                          {localizedTitle}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {localizedDesc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL DETAILS */}
          {activeTab === 'technical' && (
            <div className="w-full max-w-3xl space-y-6">
              <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-serif font-bold text-amber-400">
                    {t.tabTech}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.fileSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">{t.coordLabel}</span>
                    <p className="text-amber-300 font-bold">35.484° N, 6.469° E</p>
                  </div>

                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">{t.areaLabel}</span>
                    <p className="text-amber-300 font-bold">{t.areaVal}</p>
                  </div>

                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">{t.yearLabel}</span>
                    <p className="text-amber-300 font-bold">1982</p>
                  </div>

                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">{t.managerLabel}</span>
                    <p className="text-amber-300 font-bold">OGEBC & Wilaya de Batna</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">
                    {t.lawsHead}
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 font-sans">
                    <li>{t.law1}</li>
                    <li>{t.law2}</li>
                    <li>{t.law3}</li>
                    <li>{t.bpText}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Lightbox for gallery images */}
      {activeLightbox && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-4xl w-full bg-[#1e1e1e] border border-amber-500/30 rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-mono font-bold">
                {activeLightbox.title[language as keyof typeof activeLightbox.title] || activeLightbox.title.fr}
              </span>
              <button 
                onClick={() => setActiveLightbox(null)}
                className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <img 
              src={activeLightbox.src} 
              alt={activeLightbox.title.fr} 
              className="w-full h-[65vh] object-contain rounded bg-black"
            />
            <p className="text-xs text-slate-300 font-sans">
              {activeLightbox.desc[language as keyof typeof activeLightbox.desc] || activeLightbox.desc.fr}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
