import React, { useState } from 'react';
import { FileText, Download, X, Eye, CheckCircle2, ShieldAlert, Award, Search, ZoomIn, ZoomOut, Printer, Bookmark, MapPin, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimgadDocumentModal } from './TimgadDocumentModal';
import { PanoramaViewer } from './PanoramaViewer';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage } from './rahala/LazyImage';

const translations = {
  fr: {
    title: "LISTE DU PATRIMOINE MONDIAL",
    org: "ORGANISATION DES NATIONS UNIES POUR L'ÉDUCATION, LA SCIENCE ET LA CULTURE",
    idBoxTitle: "A) IDENTIFICATION DU BIEN",
    bienPropose: "Bien proposé :",
    lieu: "Lieu :",
    etatPartie: "État Partie :",
    dateInscription: "Date d'inscription :",
    photoCaption: "Document Officiel UNESCO N° 555 : Site authentique et architecture séculaire de la Casbah d'Alger.",
    valeurTitre: "VALEUR UNIVERSELLE EXCEPTIONNELLE — BRÈVE SYNTHÈSE",
    criteresTitle: "CRITÈRES D'INSCRIPTION & ÉVALUATION DU BIEN (2009 / 1990)",
    criteresII: "Critère (ii) : Influence sur l'Architecture & l'Urbanisme",
    criteresV: "Critère (v) : Exemple Éminent d'Habitat Humain Traditionnel",
    integriteAuthenticiteTitle: "INTÉGRITÉ & AUTHENTICITÉ",
    protectionTitle: "PROTECTION ET CADRE JURIDIQUE",
    rapportIcomosTitle: "RAPPORT D'ÉVALUATION DE L'ICOMOS (NOVEMBRE 1991)",
    page1: "Page 1 de 3",
    page2: "Page 2 de 3",
    page3: "Page 3 de 3",
    certifie: "✓ DOCUMENT OFFICIEL CERTIFIÉ",
    orgDate: "ORGANISATION UNESCO • 1990/1992",
    tabDoc: "Document Certifié ICOMOS (Textes)",
    tabPhotos: "Galerie Photographique d'Époque",
    synBody: "« Dans l’un des plus beaux sites maritimes de la Méditerranée, surplombant les îlots où un comptoir carthaginois fut installé dès le IVe siècle av. J.-C., la Casbah constitue un type unique de médina, ou ville islamique. Lieu de mémoire autant que d’histoire, elle comprend des vestiges de la citadelle, des mosquées anciennes, des palais ottomans, ainsi qu’une structure urbaine traditionnelle associée à un grand sens de la communauté. »",
    description: "La Casbah d'Alger apparaît comme un exemple significatif de ville historique maghrébine qui eut une grande influence sur l'urbanisme dans la partie occidentale de la Méditerranée et en Afrique sub-saharienne. Situé sur la côte méditerranéenne, le site fut habité au moins dès le VIe siècle avant notre ère quand un comptoir phénicien y fut installé. Le terme Casbah, qui désignait à l'origine le point culminant de la médina de l'époque ziride, s'applique aujourd'hui à l'ensemble de la vieille ville d'El Djazair, dans les limites marquées par les remparts d'époque ottomane édifiés dès la fin du XVIe siècle. Dans cet ensemble vivant où résident près de 50.000 personnes, se conservent encore de très intéressantes habitations traditionnelles, palais, hammams, mosquées et divers souks, dont la forme urbaine représente le témoignage d'une stratification de plusieurs tendances.",
    critereIIBody: "La Casbah d'Alger a exercé une influence considérable sur l'architecture et la planification urbaine en Afrique du Nord, en Andalousie et en Afrique sub-saharienne durant les XVIe et XVIIe siècles. Ces échanges se manifestent par le caractère spécifique de son habitat et par la densité de sa stratification urbaine.",
    critereVBody: "La Casbah d'Alger est un exemple éminent d'un habitat humain traditionnel représentatif de la culture musulmane profondément méditerranéenne, synthèse de nombreuses traditions. Les vestiges de la citadelle, des mosquées anciennes, des palais ottomans, ainsi qu'une structure urbaine traditionnelle associée à un grand sens de la communauté sont les témoins de cette culture.",
    integBody: "Malgré les mutations et les aléas sismiques qu'elle a subis, la Casbah d'Alger conserve toujours son intégrité. Dans leur ensemble, les caractères esthétiques, les matériaux utilisés et les éléments architecturaux gardent leurs aspects originaux qui expriment les valeurs ayant prévalu au classement du site en 1992.",
    authenBody: "Les attributs de la Valeur universelle exceptionnelle sont maintenus. La Casbah témoigne d'une authenticité remarquable, aussi bien au niveau de la forme et de la conception (trame urbaine très dense), des matériaux de construction (briques en terre crue, enduits de terre et à la chaux, pierre et bois) que de l'utilisation.",
    protBody: "La Casbah d'Alger fut classée site historique national en novembre 1991 et secteur sauvegardé en 2003. Le cadre juridique comprend les lois 98.04 (protection du patrimoine culturel) et le Plan de sauvegarde et de mise en valeur (PPSMVSS, décret n° 324-2003) géré par la Direction de la Culture de la Wilaya d'Alger et l'OGEBC.",
    rapportBody: "Que l'inscription de ce bien culturel sur la Liste du Patrimoine mondial soit confirmée avec l'engagement des autorités algériennes à l'égard de la conservation de la Casbah.",
    obsHist: "Accueilli à bras ouverts par la population locale, un corsaire turc — Khaïr al-Din — installe sa capitale à Alger (1516) et soumet une grande partie du littoral algérien au sultan ottoman. Dans la ville se conjugue la science de l'architecture militaire turque avec les traditions architecturales arabe-méditerranéennes (habitations ordonnées autour d'un patio central et surmontées de terrasses).",
    justif: "Un très intelligent plan de réaménagement de la Casbah est en cours pour réinstaller le confort moderne sans bouleverser l'urbanisme traditionnel, et conserver ce précieux témoin d'événements historiques parmi les plus marquants de l'histoire du peuple algérien."
  },
  en: {
    title: "WORLD HERITAGE LIST",
    org: "UNITED NATIONS EDUCATIONAL, SCIENTIFIC AND CULTURAL ORGANIZATION",
    idBoxTitle: "A) IDENTIFICATION OF THE PROPERTY",
    bienPropose: "Property proposed:",
    lieu: "Location:",
    etatPartie: "State Party:",
    dateInscription: "Inscription Date:",
    photoCaption: "Official UNESCO Document N° 555: Authentic site and secular architecture of the Casbah of Algiers.",
    valeurTitre: "OUTSTANDING UNIVERSAL VALUE — BRIEF SYNTHESIS",
    criteresTitle: "INSCRIPTION CRITERIA & PROPERTY EVALUATION (2009 / 1990)",
    criteresII: "Criterion (ii): Influence on Architecture & Urbanism",
    criteresV: "Criterion (v): Eminently Representative Example of Traditional Human Habitat",
    integriteAuthenticiteTitle: "INTEGRITY & AUTHENTICITY",
    protectionTitle: "PROTECTION AND LEGAL FRAMEWORK",
    rapportIcomosTitle: "ICOMOS EVALUATION REPORT (NOVEMBER 1991)",
    page1: "Page 1 of 3",
    page2: "Page 2 of 3",
    page3: "Page 3 of 3",
    certifie: "✓ OFFICIAL CERTIFIED DOCUMENT",
    orgDate: "UNESCO ORGANIZATION • 1990/1992",
    tabDoc: "ICOMOS Certified Document (Texts)",
    tabPhotos: "Historical Photo Gallery",
    synBody: "“In one of the most beautiful maritime sites of the Mediterranean, overlooking the islets where a Carthaginian trading post was installed as early as the 4th century BC, the Casbah constitutes a unique type of medina, or Islamic city. A place of memory as much as of history, it includes vestiges of the citadel, ancient mosques, Ottoman palaces, as well as a traditional urban structure associated with a great sense of community.”",
    description: "The Casbah of Algiers appears as a significant example of a historic Maghreb city that had a great influence on urban planning in the western part of the Mediterranean and in sub-Saharan Africa. Located on the Mediterranean coast, the site was inhabited at least from the 6th century BC when a Phoenician trading post was installed there. The term Casbah, which originally designated the highest point of the medina of the Zirid era, today applies to the entire old city of El Djazair, within the limits marked by the Ottoman-era ramparts built from the end of the 16th century. In this living ensemble where nearly 50,000 people reside, very interesting traditional dwellings, palaces, hammams, mosques and various souks are still preserved, the urban form of which represents the testimony of a stratification of several tendencies.",
    critereIIBody: "The Casbah of Algiers has exerted considerable influence on architecture and urban planning in North Africa, Andalusia and sub-Saharan Africa during the 16th and 17th centuries. These exchanges are manifested by the specific character of its habitat and by the density of its urban stratification.",
    critereVBody: "The Casbah of Algiers is an eminent example of traditional human habitat representative of deeply Mediterranean Muslim culture, a synthesis of numerous traditions. The vestiges of the citadel, ancient mosques, Ottoman palaces, as well as a traditional urban structure associated with a great sense of community are witnesses to this culture.",
    integBody: "Despite the mutations and seismic hazards it has undergone, the Casbah of Algiers still retains its integrity. As a whole, the aesthetic characteristics, the materials used and the architectural elements keep their original aspects which express the values that prevailed at the time of the site's classification in 1992.",
    authenBody: "The attributes of Outstanding Universal Value are maintained. The Casbah bears witness to remarkable authenticity, both in terms of form and design (very dense urban fabric), construction materials (mud bricks, earth and lime plaster, stone and wood) and use.",
    protBody: "The Casbah of Algiers was classified as a national historic site in November 1991 and a protected sector in 2003. The legal framework includes laws 98.04 (protection of cultural heritage) and the Safeguarding and Enhancement Plan (PPSMVSS, decree no. 324-2003) managed by the Directorate of Culture of the Wilaya of Algiers and the OGEBC.",
    rapportBody: "That the inscription of this cultural property on the World Heritage List be confirmed with the commitment of the Algerian authorities regarding the conservation of the Casbah.",
    obsHist: "Welcomed with open arms by the local population, a Turkish corsair — Khaïr al-Din — installed his capital in Algiers (1516) and subjected a large part of the Algerian coastline to the Ottoman sultan. In the city, the science of Turkish military architecture is combined with Arab-Mediterranean architectural traditions (dwellings arranged around a central patio and topped with terraces).",
    justif: "A very intelligent redevelopment plan for the Casbah is underway to reinstall modern comfort without disrupting traditional urban planning, and to preserve this precious witness to historical events among the most significant in the history of the Algerian people."
  },

  ar: {
    title: "قائمة التراث العالمي",
    org: "منظمة الأمم المتحدة للتربية والعلم والثقافة",
    idBoxTitle: "أ) تحديد المعلم الأثري",
    bienPropose: "المعلم المقترح:",
    lieu: "الموقع:",
    etatPartie: "الدولة الطرف:",
    dateInscription: "تاريخ التسجيل:",
    photoCaption: "وثيقة اليونسكو الرسمية رقم 555: موقع أصيل وعمارة علمانية لقصبة الجزائر.",
    valeurTitre: "القيمة العالمية الاستثنائية — ملخص موجز",
    criteresTitle: "معايير التسجيل وتقييم المعلم (2009 / 1990)",
    criteresII: "المعيار (ثانياً): التأثير على العمارة والتخطيط العمراني",
    criteresV: "المعيار (خامساً): مثال بارز للموائل البشرية التقليدية",
    integriteAuthenticiteTitle: "النزاهة والأصالة",
    protectionTitle: "الحماية والإطار القانوني",
    rapportIcomosTitle: "تقرير تقييم الإيكوموس (نوفمبر 1991)",
    page1: "الصفحة 1 من 3",
    page2: "الصفحة 2 من 3",
    page3: "الصفحة 3 من 3",
    certifie: "✓ وثيقة رسمية معتمدة",
    orgDate: "منظمة اليونسكو • 1990/1992",
    tabDoc: "وثيقة الإيكوموس المعتمدة (نصوص)",
    tabPhotos: "معرض الصور التاريخية"
  },
  es: {
    title: "LISTA DEL PATRIMONIO MUNDIAL",
    org: "ORGANIZACIÓN DE LAS NACIONES UNIDAS PARA LA EDUCACIÓN, LA CIENCIA Y LA CULTURA",
    idBoxTitle: "A) IDENTIFICACIÓN DEL BIEN",
    bienPropose: "Bien propuesto:",
    lieu: "Ubicación:",
    etatPartie: "Estado Parte:",
    dateInscription: "Fecha de inscripción:",
    photoCaption: "Documento Oficial UNESCO N° 555: Sitio auténtico y arquitectura secular de la Casbah de Argel.",
    valeurTitre: "VALOR UNIVERSAL EXCEPCIONAL — BREVE SÍNTESIS",
    criteresTitle: "CRITERIOS DE INSCRIPCIÓN Y EVALUACIÓN DEL BIEN (2009 / 1990)",
    criteresII: "Criterio (ii): Influencia en la Arquitectura y Urbanismo",
    criteresV: "Criterio (v): Ejemplo Eminente de Hábitat Humano Tradicional",
    integriteAuthenticiteTitle: "INTEGRIDAD Y AUTENTICIDAD",
    protectionTitle: "PROTECCIÓN Y MARCO JURÍDICO",
    rapportIcomosTitle: "INFORME DE EVALUACIÓN DEL ICOMOS (NOVIEMBRE 1991)",
    page1: "Página 1 de 3",
    page2: "Página 2 de 3",
    page3: "Página 3 de 3",
    certifie: "✓ DOCUMENTO OFICIAL CERTIFICADO",
    orgDate: "ORGANIZACIÓN UNESCO • 1990/1992",
    tabDoc: "Documento Certificado ICOMOS (Textos)",
    tabPhotos: "Galería de Fotos Históricas"
  }
};

interface UnescoDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
}

export const UnescoDocumentModal: React.FC<UnescoDocumentModalProps> = ({
  isOpen,
  onClose,
  siteName = "La Casbah d'Alger"
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'document' | 'photos' | 'criteria'>('document');
  const { language, setLanguage, isRtl } = useLanguage();
  const t: any = translations[language] || translations.fr;

  if (!isOpen) return null;

  if (siteName.toLowerCase().includes('timgad') || siteName.toLowerCase().includes('thamugadi')) {
    return <TimgadDocumentModal isOpen={isOpen} onClose={onClose} siteName={siteName} />;
  }

  const handleDownload = () => {
    // Generate text download or simulate file download
    const element = document.createElement("a");
    const file = new Blob([
      `UNESCO - ${t.title} N° 555\n\n` +
      `${t.bienPropose} Casbah d'Alger\n` +
      `${t.lieu} Ville d'Alger, Algérie\n` +
      `${t.dateInscription} 6 mars 1990 (UNESCO 1992)\n\n` +
      `${t.valeurTitre}:\n` +
      `${t.synBody}\n\n` +
      `${t.criteresTitle}:\n` +
      `- ${t.criteresII}.\n` +
      `- ${t.criteresV}.\n\n` +
      `${t.integriteAuthenticiteTitle}:\n` +
      `${t.authenBody}`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = t.fileName.replace('.pdf', '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-green-900/80 backdrop-blur-sm animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white text-black border border-red-600 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* PDF Header Toolbar */}
        <div className="bg-green-700 border-b border-green-600 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 space-x-reverse min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold shrink-0">
              <Award size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="font-mono font-bold text-white text-xs sm:text-sm truncate">
                UNESCO_Dossier_N555_Casbah_dAlger.pdf
              </h2>
              <p className="text-[10px] text-green-100 font-mono">
                Patrimoine Mondial de l'Humanité • République Algérienne Démocratique et Populaire
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">

            {/* Language Switcher Pills */}
            <div className="flex items-center bg-green-800 rounded-lg p-1 border border-red-600/30 font-mono text-[10px] space-x-1 space-x-reverse">
              {(['fr', 'ar', 'en', 'es'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded font-bold uppercase transition cursor-pointer ${
                    language === lang 
                      ? 'bg-red-600 text-white shadow-xs' 
                      : 'text-green-100 hover:text-white hover:bg-green-600'
                  }`}
                  title={`Language: ${lang.toUpperCase()}`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-green-800 rounded-lg p-1 border border-green-600 font-mono text-[11px]">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-green-600 rounded disabled:opacity-30 cursor-pointer text-white"
                title="Page précédente"
              >
                <ChevronLeft size={14} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <span className="px-2 text-white font-bold">
                {currentPage} / 3
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
                disabled={currentPage === 3}
                className="p-1 hover:bg-green-600 rounded disabled:opacity-30 cursor-pointer text-white"
                title="Page suivante"
              >
                <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>

            <div className="hidden md:flex items-center bg-green-800 rounded-lg p-1 border border-green-600 font-mono text-[11px]">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                className="p-1 hover:bg-green-600 rounded cursor-pointer text-white"
                title="Zoom arrière"
              >
                <ZoomOut size={14} />
              </button>
              <span className="px-2 text-white">
                {zoomLevel}%
              </span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 25))}
                className="p-1 hover:bg-green-600 rounded cursor-pointer text-white"
                title="Zoom avant"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-xs transition cursor-pointer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Télécharger Officiel</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              title="Fermer le document"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-green-800 border-b border-green-700 px-4 py-2 flex space-x-2 space-x-reverse text-xs font-mono">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 space-x-reverse whitespace-nowrap ${
              activeTab === 'document' ? 'bg-red-600 text-white border border-red-700 font-bold' : 'text-green-100 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>{t.tabDoc}</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 space-x-reverse whitespace-nowrap ${
              activeTab === 'photos' ? 'bg-red-600 text-white border border-red-700 font-bold' : 'text-green-100 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>{t.tabPhotos}</span>
          </button>
        </div>

        {/* PDF Document Canvas View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-green-50 flex justify-center">
          
          {activeTab === 'document' && (
            <div 
              className="bg-white text-black shadow-2xl border border-green-200 p-6 sm:p-12 max-w-3xl w-full min-h-[850px] font-serif transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* PAGE 1 CONTENT */}
              {currentPage === 1 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  {/* Official UNESCO Stamp & Header */}
                  <div className="border-b-2 border-red-600 pb-4 flex justify-between items-start">
                    <div>
                      <h1 className="text-base sm:text-xl font-bold uppercase tracking-widest text-black">
                        {t.title}
                      </h1>
                      <p className="text-xs font-sans font-bold text-green-700 uppercase tracking-wider mt-0.5">
                        {t.org}
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs border-2 border-red-600 p-2 font-bold bg-white">
                      N° 555
                    </div>
                  </div>

                  {/* Identification Box */}
                  <div className="bg-green-50 border border-green-200 p-4 font-sans text-xs space-y-2">
                    <h2 className="font-bold font-serif text-sm border-b border-green-200 pb-1 text-green-900">
                      {t.idBoxTitle}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black">
                      <div><strong className="text-black">{t.bienPropose}</strong> La Casbah d'Alger</div>
                      <div><strong className="text-black">{t.lieu}</strong> Ville d'Alger (Wilaya d'Alger)</div>
                      <div><strong className="text-black">{t.etatPartie}</strong> Algérie 🇩🇿</div>
                      <div><strong className="text-black">{t.dateInscription}</strong> 6 mars 1990 (UNESCO 1992)</div>
                    </div>
                  </div>

                  {/* High Resolution Primary Photo */}
                  <div className="my-4 border border-green-200 p-2 bg-white rounded shadow-sm">
                    <LazyImage 
                      src="/src/assets/images/casbah_d_alger/site_0565_0017-1000-1481-20140721144417.webp" 
                      alt="Casbah d'Alger - Vue panoramique officielle" 
                      className="w-full h-64 rounded"
                    />
                    <p className="text-[10px] font-sans text-green-700 italic mt-1.5 text-center">
                      {t.photoCaption}
                    </p>
                  </div>

                  {/* Brève Synthèse */}
                  <div>
                    <h2 className="font-bold font-sans text-sm text-black uppercase border-b border-green-200 pb-1 mb-2">
                      {t.valeurTitre}
                    </h2>
                    <p className="text-justify italic text-black leading-relaxed bg-red-50/30 p-3 border-l-4 border-red-600">
                      {t.synBody}
                    </p>
                  </div>

                  {/* Description Détallée */}
                  <div className="space-y-3 text-black font-sans text-xs">
                    <p className="text-justify">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-green-200 flex justify-between text-[10px] font-mono text-green-700">
                    <span>UNESCO • Patrimoine Mondial N° 555</span>
                    <span>{t.page1}</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b border-green-200 pb-2">
                    <h2 className="font-bold font-sans text-base text-black uppercase">
                      {t.criteresTitle}
                    </h2>
                  </div>

                  {/* Critères */}
                  <div className="space-y-4 font-sans text-xs">
                    <div className="p-3 bg-white border-l-4 border-green-800">
                      <h3 className="font-bold text-black mb-1">
                        {t.criteresII}
                      </h3>
                      <p className="text-black text-justify">
                        {t.critereIIBody}
                      </p>
                    </div>

                    <div className="p-3 bg-white border-l-4 border-green-800">
                      <h3 className="font-bold text-black mb-1">
                        {t.criteresV}
                      </h3>
                      <p className="text-black text-justify">
                        {t.critereVBody}
                      </p>
                    </div>
                  </div>

                  {/* Intégrité & Authenticité */}
                  <div className="space-y-3 font-sans text-xs pt-2">
                    <h3 className="font-bold font-serif text-sm text-black border-b border-green-200 pb-1">
                      {t.integriteAuthenticiteTitle}
                    </h3>
                    
                    <div className="text-black space-y-2">
                      <p>
                        <strong>Intégrité :</strong> {t.integBody}
                      </p>
                      <p>
                        <strong>Authenticité :</strong> {t.authenBody}
                      </p>
                    </div>
                  </div>

                  {/* Protection & Gestion */}
                  <div className="bg-green-50 p-4 border border-green-200 font-sans text-xs space-y-2">
                    <h3 className="font-bold font-serif text-sm text-green-900 border-b border-green-200 pb-1">
                      {t.protectionTitle}
                    </h3>
                    <p className="text-black text-justify">
                      {t.protBody}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-green-200 flex justify-between text-[10px] font-mono text-green-700">
                    <span>UNESCO • Patrimoine Mondial N° 555</span>
                    <span>{t.page2}</span>
                  </div>
                </div>
              )}

              {/* PAGE 3 CONTENT */}
              {currentPage === 3 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-red-600 pb-2 flex justify-between items-center">
                    <h2 className="font-bold font-serif text-base text-black uppercase">
                      {t.rapportIcomosTitle}
                    </h2>
                    <span className="font-mono text-[10px] bg-green-100 px-2 py-0.5 rounded text-green-900">DOCUMENT D'ARCHIVE</span>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-black">
                    <div className="p-3 bg-green-50 border border-green-200 font-mono text-[11px] leading-relaxed">
                      <p><strong>B) RECOMMANDATION DE L'ICOMOS :</strong></p>
                      <p>{t.rapportBody}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-black mb-1">C) OBSERVATIONS HISTORIQUES ET ARCHITECTURALES :</h3>
                      <p className="text-justify mb-2">
                        {t.obsHist}
                      </p>
                    </div>

                    <div className="border-t border-green-200 pt-3">
                      <h3 className="font-bold text-black mb-1">D) JUSTIFICATION DU CLASSEMENT :</h3>
                      <p className="text-justify">
                        {t.justif}
                      </p>
                    </div>
                  </div>

                  {/* Stamp Seal */}
                  <div className="pt-6 flex justify-end">
                    <div className="border-2 border-red-600 text-red-900 p-3 font-mono text-[10px] text-center uppercase tracking-widest rounded bg-white">
                      {t.certifie}<br />
                      {t.orgDate}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-200 flex justify-between text-[10px] font-mono text-green-700">
                    <span>UNESCO • Patrimoine Mondial N° 555</span>
                    <span>{t.page3}</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* GALLERY TAB VIEW */}
          {activeTab === 'photos' && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="bg-white p-4 rounded-xl border border-green-200">
                <h3 className="text-green-900 font-bold font-serif text-sm mb-1">
                  Photographies Authentiques de la Casbah d'Alger (Dossier UNESCO N° 555)
                </h3>
                <p className="text-black text-xs">
                  Collection complète des clichés authentiques certifiés : panorama des terrasses, ruelles en escalier, patios ottomans, fontaines zellige et passages sous voûte (sabat).
                </p>
              </div>

              {/* INTERACTIVE 360 PANORAMA VIEWER */}
              <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-green-500/30 bg-black relative shadow-2xl">
                <PanoramaViewer
                  imagePath="/panorama/casabah Street View 360.jpg"
                  title="La Casbah d'Alger — Photographie Originale 360°"
                  subtitle="Alger, Médina Historique • Cliché d'Origine Non Modifié (casabah Street View 360.jpg)"
                  className="w-full h-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0017-1000-1481-20140721144417.webp", label: "Vue Générale & Structure Urbaine de la Casbah" },
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0013-1000-1333-20180730112533.webp", label: "Architecture Ottomane & Ruelles Historiques" },
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0016-1000-1481-20140721144450.webp", label: "Patrimoine Sécullaire & Maçonnerie Traditionnelle" },
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0019-1000-1481-20140721144413.webp", label: "Passages sous Voûte (Sabat) & Détails Architecturaux" },
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0020-1000-1481-20140721144415.webp", label: "Bâtiments Historiques & Citadelle d'Alger" },
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0021-1000-1481-20140721144447.webp", label: "Perspective Urbaine de la Médina" },
                  { src: "/src/assets/images/casbah_d_alger/site_0565_0022-1000-1481-20140721144409.webp", label: "Comptoir Historique & Vestiges de la Casbah" },
                  { src: "/src/assets/images/casbah_d_alger/casbah_vaulted_alley.jpg", label: "Ruelle Voûtée Traditionnelle" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-xl border border-green-200 space-y-2">
                    <LazyImage src={item.src} alt={item.label} className="w-full h-56 rounded-lg" />
                    <p className="text-[11px] text-green-900 font-mono text-center">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
