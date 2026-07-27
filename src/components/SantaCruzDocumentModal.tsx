import React, { useState } from 'react';
import { FileText, Download, X, Eye, Award, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BookOpen, ShieldCheck, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage } from './rahala/LazyImage';
import { PanoramaViewer } from './PanoramaViewer';

const translations = {
  fr: {
    title: "Chapelle Notre-Dame du Salut & Fort Santa Cruz (Oran)",
    fileName: "Etude_Historique_Chapelle_Santa_Cruz_Oran.pdf",
    fileSubtitle: "Archives Historiques d'Oran • Dr. D. Senhadji (USTO) & Dr. A. Bravo-Nieto",
    downloadBtn: "Télécharger PDF",
    close: "Fermer",
    tabDoc: "Document d'Étude & Archives",
    tabPhotos: "Galerie Photographique du Site",
    tab360: "Visite Virtuelle 360° Immersive",
    p1Header: "UNIVERSITÉ DES SCIENCES ET DE LA TECHNOLOGIE MOHAMED BOUDIAF (USTO, ORAN)",
    p1Title: "UN SITE EMBLEMÁTIQUE DE LA VILLE D'ORAN : LA CHAPELLE DE SANTA-CRUZ",
    p1Sub: "Par Dalila SENHADJI, Architecte, enseignante-chercheure, Département d'Architecture",
    s1Title: "CONTEXTE HISTORIQUE & L'ÉPIDÉMIE DE CHOLÉRA DE 1849",
    s1Body: "« En 1849, une terrible épidémie de choléra s’abat sur Oran et ses environs. Du 14 au 31 octobre, il y eut 1 173 décès. L’absence de pluies pousse le général Pélissier à solliciter l’évêché afin d’installer sur la montagne, en contrebas du fort espagnol de Santa-Cruz, une statue de la Vierge qui se chargera de jeter le choléra à la mer. »",
    photoDesc: "Vue sur la chapelle Notre-Dame du Salut, la tour monumentale et le fort de Santa-Cruz sur le mont Murdjadjo.",
    s2Title: "1.1 La Construction de la Première Chapelle (1849 – 1850)",
    s2Body: "Une modeste chapelle commémorative est édifiée par souscriptions publiques en 1849-1850. Le terrain, d'une superficie de 560 m², situé sur un emplacement stratégique offrant une vue panoramique sur la mer et la baie de Mers-El-Kébir, est cédé par le Ministère de la Guerre le 20 janvier 1850.",
    s2Body2: "L'édifice est solennellement béni le 9 mai 1850. La voûte initiale, construite dans l'urgence des débuts de la colonisation, s'effondre peu après avant d'être rebâtie en 1851.",
    footer: "Archives Historiques d'Oran • Monument Classé",
    page: "Page"
  },
  en: {
    title: "Chapel of Notre-Dame du Salut & Santa Cruz Fort (Oran)",
    fileName: "Historical_Study_Santa_Cruz_Chapel_Oran.pdf",
    fileSubtitle: "Historical Archives of Oran • Dr. D. Senhadji (USTO) & Dr. A. Bravo-Nieto",
    downloadBtn: "Download PDF",
    close: "Close",
    tabDoc: "Study Document & Archives",
    tabPhotos: "Site Photo Gallery",
    tab360: "Immersive 360° Virtual Tour",
    p1Header: "MOHAMED BOUDIAF UNIVERSITY OF SCIENCE AND TECHNOLOGY (USTO, ORAN)",
    p1Title: "AN EMBLEMATIC SITE OF THE CITY OF ORAN: THE SANTA CRUZ CHAPEL",
    p1Sub: "By Dalila SENHADJI, Architect, Researcher, Department of Architecture",
    s1Title: "HISTORICAL CONTEXT & THE 1849 CHOLERA EPIDEMIC",
    s1Body: "“In 1849, a terrible cholera epidemic struck Oran and its surroundings. From October 14 to 31, there were 1,173 deaths. The absence of rain pushed General Pélissier to ask the bishopric to install on the mountain, below the Spanish fort of Santa-Cruz, a statue of the Virgin that would take charge of throwing the cholera into the sea.”",
    photoDesc: "View of the Notre-Dame du Salut chapel, the monumental tower, and the Santa Cruz fort on Mount Murdjadjo.",
    s2Title: "1.1 Construction of the First Chapel (1849 – 1850)",
    s2Body: "A modest commemorative chapel was built by public subscriptions in 1849-1850. The land, with an area of 560 m², located on a strategic site offering a panoramic view of the sea and the bay of Mers-El-Kébir, was ceded by the Ministry of War on January 20, 1850.",
    s2Body2: "The building was solemnly blessed on May 9, 1850. The initial vault, built in the urgency of the early days of colonization, collapsed shortly after before being rebuilt in 1851.",
    footer: "Historical Archives of Oran • Listed Monument",
    page: "Page"
  },
  ar: {
    title: "كنيسة نوتردام دو سالو وحصن سانتا كروز (وهران)",
    fileName: "دراسة_تاريخية_كنيسة_سانتا_كروز_وهران.pdf",
    fileSubtitle: "أرشيف وهران التاريخي • د. د. سنهجي (جامعة العلوم والتكنولوجيا بوهران) و د. أ. برافو-نييتو",
    downloadBtn: "تحميل PDF",
    close: "إغلاق",
    tabDoc: "وثيقة الدراسة والأرشيف",
    tabPhotos: "معرض صور الموقع",
    tab360: "جولة افتراضية 360 درجة",
    p1Header: "جامعة العلوم والتكنولوجيا محمد بوضياف (وهران)",
    p1Title: "موقع رمزي لمدينة وهران: كنيسة سانتا كروز",
    p1Sub: "بقلم دليلة سنهجي، مهندسة معمارية، باحثة، قسم الهندسة المعمارية",
    s1Title: "السياق التاريخي ووباء الكوليرا عام 1849",
    s1Body: "«في عام 1849، ضرب وباء الكوليرا الرهيب وهران وضواحيها. من 14 إلى 31 أكتوبر، كان هناك 1173 حالة وفاة. دفع غياب الأمطار الجنرال بيليسييه لطلب الأسقفية لتثبيت تمثال العذراء على الجبل، أسفل الحصن الإسباني سانتا كروز، الذي سيتولى إلقاء الكوليرا في البحر.»",
    photoDesc: "إطلالة على كنيسة نوتردام دو سالو، البرج الضخم، وحصن سانتا كروز على جبل مرجاجو.",
    s2Title: "1.1 بناء الكنيسة الأولى (1849 - 1850)",
    s2Body: "تم بناء كنيسة تذكارية متواضعة من خلال الاكتتابات العامة في 1849-1850. تنازلت وزارة الحرب عن الأرض التي تبلغ مساحتها 560 متر مربع، والواقعة في موقع استراتيجي يوفر إطلالة بانورامية على البحر وخليج مرسى الكبير، في 20 يناير 1850.",
    s2Body2: "تمت مباركة المبنى رسمياً في 9 مايو 1850. القبو الأولي، الذي بُني على عجل في بدايات الاستعمار، انهار بعد فترة وجيزة قبل إعادة بنائه في عام 1851.",
    footer: "أرشيف وهران التاريخي • معلم مصنف",
    page: "صفحة"
  },
  es: {
    title: "Capilla de Nuestra Señora de la Salud y Fuerte Santa Cruz (Orán)",
    fileName: "Estudio_Historico_Capilla_Santa_Cruz_Oran.pdf",
    fileSubtitle: "Archivos Históricos de Orán • Dr. D. Senhadji (USTO) & Dr. A. Bravo-Nieto",
    downloadBtn: "Descargar PDF",
    close: "Cerrar",
    tabDoc: "Documento de Estudio y Archivos",
    tabPhotos: "Galería de Fotos del Sitio",
    tab360: "Visita Virtual 360° Inmersiva",
    p1Header: "UNIVERSIDAD DE CIENCIAS Y TECNOLOGÍA MOHAMED BOUDIAF (USTO, ORÁN)",
    p1Title: "UN SITIO EMBLEMÁTICO DE LA CIUDAD DE ORÁN: LA CAPILLA DE SANTA CRUZ",
    p1Sub: "Por Dalila SENHADJI, Arquitecta, Investigadora, Departamento de Arquitectura",
    s1Title: "CONTEXTO HISTÓRICO Y LA EPIDEMIA DE CÓLERA DE 1849",
    s1Body: "«En 1849, una terrible epidemia de cólera azotó Orán y sus alrededores. Del 14 al 31 de octubre, hubo 1.173 muertes. La ausencia de lluvia llevó al general Pélissier a solicitar al obispado instalar en la montaña, debajo del fuerte español de Santa Cruz, una estatua de la Virgen que se encargaría de arrojar el cólera al mar.»",
    photoDesc: "Vista de la capilla de Nuestra Señora de la Salud, la torre monumental y el fuerte de Santa Cruz en el monte Murdjadjo.",
    s2Title: "1.1 Construcción de la Primera Capilla (1849 – 1850)",
    s2Body: "Una modesta capilla conmemorativa fue construida mediante suscripciones públicas en 1849-1850. El terreno, de una superficie de 560 m², ubicado en un lugar estratégico con vista panorámica al mar y a la bahía de Mers-El-Kébir, fue cedido por el Ministerio de la Guerra el 20 de enero de 1850.",
    s2Body2: "El edificio fue solemnemente bendecido el 9 de mayo de 1850. La bóveda inicial, construida con urgencia en los primeros días de la colonización, colapsó poco después antes de ser reconstruida en 1851.",
    footer: "Archivos Históricos de Orán • Monumento Clasificado",
    page: "Página"
  }
};

const santaCruzFolderModules = import.meta.glob('/src/assets/images/Santa Cruz Fort & Chapelle Notre-Dame du Salut/*.{webp,jpg,JPG,jpeg,png}', { eager: true, import: 'default' });
const santaCruzImagesList = Object.values(santaCruzFolderModules) as string[];

const primarySantaCruzPhoto = santaCruzImagesList.find(img => img.includes('Fort_Santa_Cruz_Oran1') || img.includes('Fort-de-Santa-Cruz') || img.includes('web-oran-santa-cruz')) 
  || santaCruzImagesList[0] 
  || '/src/assets/images/santa_cruz_oran_chapel_1784672157047.jpg';

const santaCruzGalleryItems = [
  { src: "/panorama/santa cruz Street View 360.jpg", label: "Vue 360° Immersive - Cour Intérieure & Clocher Chapelle Santa Cruz" },
  { src: primarySantaCruzPhoto, label: "Vue Panoramique & Fort de Santa Cruz" },
  ...santaCruzImagesList.map((src, idx) => ({
    src,
    label: `Cliché Authentique N°${idx + 1} - Fort & Chapelle Santa Cruz`
  })),
  { src: "/src/assets/images/santa_cruz_oran_chapel_1784672157047.jpg", label: "Vue Aérienne de la Chapelle Notre-Dame du Salut" }
].filter((item, index, self) => index === self.findIndex(t => t.src === item.src));

interface SantaCruzDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
}

export const SantaCruzDocumentModal: React.FC<SantaCruzDocumentModalProps> = ({
  isOpen,
  onClose,
  siteName = "Chapelle Notre-Dame du Salut & Fort Santa Cruz (Oran)"
}) => {
  const { language, setLanguage, isRtl } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'document' | 'photos' | '360'>('document');

  if (!isOpen) return null;

  const t = translations[language as keyof typeof translations] || translations.fr;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `======================================================================\n` +
      `REPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE\n` +
      `MINISTÈRE DE LA CULTURE — DIRECTION DU PATRIMOINE CULTURAEL\n\n` +
      `DOSSIER DE CLASSEMENT HISTORIQUE N° 1950-OR\n` +
      `SITE EMBLEMÁTIQUE: ${t.title}\n` +
      `LOCALISATION: Sommet du Mont Murdjadjo, Oran (Wahran), Algérie\n\n` +
      `--- SYNTHÈSE HISTORIQUE ET ARCHITECTURALE ---\n\n` +
      `${t.s1Title}\n\n` +
      `${t.s1Body}\n\n` +
      `${t.s2Title}\n\n` +
      `${t.s2Body}\n\n` +
      `ARCHIVES MUNICIPALES ET DIOCÉSAINES D'ORAN • ÉTUDE USTO / UNIV. DE MALAGA`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = t.fileName.replace('.pdf', '.txt');
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
              <p className="text-[10px] text-slate-400 font-mono">
                {t.fileSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
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
                {currentPage} / 4
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(4, prev + 1))}
                disabled={currentPage === 4}
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
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-xs transition cursor-pointer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Télécharger PDF</span>
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

        {/* Navigation Tabs */}
        <div className="bg-[#222222] border-b border-white/5 px-4 py-2 flex space-x-2 space-x-reverse text-xs font-mono">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'document' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>{t.tabDoc}</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'photos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>{t.tabPhotos}</span>
          </button>

          <button
            onClick={() => setActiveTab('360')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === '360' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={13} className="text-amber-400" />
            <span>{t.tab360}</span>
          </button>
        </div>

        {/* Modal View Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#121212] flex justify-center">
          
          {activeTab === 'document' && (
            <div 
              className="bg-[#fcfbf9] text-gray-900 shadow-2xl border border-gray-300 p-6 sm:p-12 max-w-3xl w-full min-h-[850px] font-serif transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* PAGE 1 */}
              {currentPage === 1 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  {/* Header */}
                  <div className="border-b-2 border-gray-900 pb-4 text-center">
                    <p className="text-[10px] font-sans font-bold text-amber-900 uppercase tracking-widest">
                      {t.p1Header}
                    </p>
                    <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-900 mt-1">
                      {t.p1Title}
                    </h1>
                    <p className="text-xs font-sans text-gray-600 mt-1 italic">
                      {t.p1Sub}
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-amber-50/60 border-l-4 border-amber-700 p-4 font-sans text-xs space-y-2 text-gray-800">
                    <h2 className="font-bold font-serif text-sm text-amber-950 uppercase border-b border-amber-200 pb-1">
                      {t.s1Title}
                    </h2>
                    <p className="text-justify italic">
                      {t.s1Body}
                    </p>
                  </div>

                  {/* Primary Photo */}
                  <div className="my-4 border border-gray-300 p-2 bg-white rounded shadow-sm">
                    <LazyImage 
                      src={primarySantaCruzPhoto} 
                      alt="Chapelle de Santa-Cruz et Fort sur le mont Murdjadjo à Oran" 
                      className="w-full h-64 rounded"
                    />
                    <p className="text-[10px] font-sans text-gray-500 italic mt-1.5 text-center">
                      {t.photoDesc}
                    </p>
                  </div>

                  {/* Text sections */}
                  <div className="space-y-3 font-sans text-xs text-gray-800">
                    <h3 className="font-bold font-serif text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {t.s2Title}
                    </h3>
                    <p className="text-justify">
                      {t.s2Body}
                    </p>
                    <p className="text-justify">
                      {t.s2Body2}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>{t.footer}</span>
                    <span>{t.page} 1 {t.page === 'Página' ? 'de' : 'de'} 4</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b border-gray-400 pb-2">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      ÉDIFICATION DE LA TOUR MONUMENTALE ET DE LA STATUE EN BRONZE (1873 – 1876)
                    </h2>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                      <h3 className="font-bold text-amber-950 mb-1">
                        1.2 La Construction de la Tour (1873)
                      </h3>
                      <p className="text-justify">
                        Oran ayant été érigée en diocèse en 1867, le premier évêque Monseigneur Jean-Baptiste Irénée Callot décide en 1873 d'élever un clocher monumental destiné à servir de piédestal à une imposante statue de la Vierge.
                      </p>
                    </div>

                    <p className="text-justify">
                      L'architecture est confiée à <strong>Viala de Sorbier</strong>, architecte du service des édifices diocésains. Une commission recueille les fonds nécessaires pour couler une statue de bronze de <strong>5 000 kg</strong>, réalisée dans le moule de celle de Notre-Dame de Fourvière à Lyon. La statue est dressée au sommet de la tour le <strong>6 décembre 1876</strong>.
                    </p>

                    <div className="bg-gray-100 p-4 border-l-4 border-gray-800 space-y-2">
                      <h3 className="font-bold text-gray-900 font-serif text-sm">
                        Projet de Basilique et Transformations (1939 – 1950)
                      </h3>
                      <p className="text-justify">
                        En 1939, Monseigneur Durand souhaite édifier une grande basilique. L'autorité militaire de la Marine impose de ne pas dominer le Fort de Santa-Cruz afin de préserver le champ de tir. Un concours est lancé en 1942, sollicitant les architectes Georges Berdollet, Yvan Barés, puis René Lesaint en 1950.
                      </p>
                      <p className="text-justify">
                        En raison des contraintes topographiques, militaires et financières, le projet est ajusté pour créer l'esplanade actuelle des pèlerinages et la chapelle surmontée d'une coupole.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>Archives Historiques d'Oran • Monument Classé</span>
                    <span>Page 2 de 4</span>
                  </div>
                </div>
              )}

              {/* PAGE 3 */}
              {currentPage === 3 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2">
                    <p className="text-[10px] font-mono text-amber-800 font-bold">ÉTUDE DE L'UNIVERSITÉ DE MALAGA & UNED</p>
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      ARCHITECTURE MILITAIRE DU XVIe SIÈCLE : LE FORT DE SANTA CRUZ (1577)
                    </h2>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <p className="text-justify">
                      Auteurs : <strong>Dr. Antonio Bravo-Nieto & Dr. Sergio Ramírez-González</strong> (<em>Architecture religieuse à Oran et fortifications au XVIe siècle</em>).
                    </p>

                    <div className="p-3 bg-amber-50/50 border border-amber-300 rounded">
                      <h3 className="font-bold text-amber-950 mb-1">
                        Le Fort Espagnol de Santa Cruz (1577 – 1580)
                      </h3>
                      <p className="text-justify">
                        Sous le règne du roi Philippe II d'Espagne, la nécessité de fortifier la crête du Murdjadjo s'impose. La conception du fort de Santa Cruz est confiée à l'ingénieur militaire italien <strong>Jacome Palearo Fratín</strong>. La première pierre est posée le <strong>3 mai 1577</strong> et la structure principale est achevée dès 1578-1580.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 font-serif text-sm border-b border-gray-300 pb-1">
                        La Chapelle Renaissance d'Origine (Leonardo Turriano, 1594)
                      </h3>
                      <p className="text-justify">
                        Sur les plans dressés en 1594 par l'ingénieur <strong>Leonardo Turriano</strong>, une première chapelle à plan carré apparaît adossée à la façade nord du fort. Inspirée de la Renaissance italienne (influence des formes de Brunelleschi), elle mesurait environ 10 mètres sur 9 mètres et abritait les services religieux des aumôniers de l'Ordre des Mercédaires.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>Archives Historiques d'Oran • Monument Classé</span>
                    <span>Page 3 de 4</span>
                  </div>
                </div>
              )}

              {/* PAGE 4 */}
              {currentPage === 4 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2 flex justify-between items-center">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      PROTECTION JURIDIQUE ET CLASSEMENT DU PATRIMOINE
                    </h2>
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                      RÉPUBLIQUE ALGÉRIENNE
                    </span>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-800 space-y-2">
                      <h3 className="font-bold text-gray-900 font-serif text-sm">
                        CLASSEMENT DU MONUMENT ET DU SITE NATUREL (1950 / 1967)
                      </h3>
                      <p className="text-justify">
                        La chapelle de Santa-Cruz, au sommet du Murdjadjo, a été classée monument historique le <strong>6 octobre 1950</strong>. Ce classement fut confirmé par la loi algérienne relative aux monuments historiques de <strong>décembre 1967</strong> et renforcé par la <strong>loi 98-04 du 15 juin 1998</strong> sur la protection du patrimoine culturel.
                      </p>
                      <p className="text-justify">
                        Le site naturel de la montagne du Murdjadjo bénéficie également d'un classement de protection intégrale. Tout projet de travaux dans un périmètre de 200 mètres est obligatoirement soumis à l'autorisation préalable du Ministère de la Culture.
                      </p>
                    </div>

                    {/* Official Seal Box */}
                    <div className="pt-8 flex justify-end">
                      <div className="border-2 border-amber-900 text-amber-950 p-3 font-mono text-[10px] text-center uppercase tracking-widest rounded bg-amber-50">
                        ✓ DOCUMENT HISTORIQUE CERTIFIÉ<br />
                        DIRECTION DU PATRIMOINE CULTUREL D'ORAN
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>Archives Historiques d'Oran • Monument Classé</span>
                    <span>Page 4 de 4</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* GALLERY TAB VIEW */}
          {activeTab === 'photos' && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10">
                <h3 className="text-amber-400 font-bold font-serif text-sm mb-1">
                  Photographies du Fort de Santa Cruz & de la Chapelle Notre-Dame du Salut (Oran)
                </h3>
                <p className="text-slate-400 text-xs">
                  Vues panoramiques du mont Murdjadjo, des murailles fortifiées espagnoles du XVIe siècle, de la tour et de la statue de Notre-Dame du Salut.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {santaCruzGalleryItems.map((item, idx) => (
                  <div key={idx} className="bg-[#1e1e1e] p-2 rounded-xl border border-white/10 space-y-2">
                    <LazyImage src={item.src} alt={item.label} className="w-full h-56 rounded-lg" />
                    <p className="text-[11px] text-slate-300 font-mono text-center">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 360 VIRTUAL TOUR TAB VIEW */}
          {activeTab === '360' && (
            <div className="w-full max-w-4xl space-y-4">
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-amber-400 font-bold font-serif text-sm mb-1 flex items-center gap-2">
                    <Compass size={16} className="text-amber-400" />
                    <span>Projection 360° Immersive — Clichés d'Origine de la Chapelle Santa-Cruz</span>
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Explorez en immersion 360° interactive les clichés authentiques du sommet du Mont Murdjadjo à Oran, la cour à dallage traditionnels, les arcades et le clocher historique.
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-300 text-[10px] font-mono shrink-0 ml-4">
                  ✓ Photo Authentique Non-IA
                </div>
              </div>

              <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-amber-500/30 bg-black relative shadow-2xl">
                <PanoramaViewer
                  imagePath="/panorama/santa cruz Street View 360.jpg"
                  title="Chapelle Notre-Dame de Santa-Cruz (Oran) — Photographie Originale 360°"
                  subtitle="Oran, Mont Murdjadjo • Cliché d'Origine Non Modifié (santa cruz Street View 360.jpg)"
                  className="w-full h-full"
                />
              </div>

              {/* Photo selector bar */}
              <div className="bg-[#181818] p-3 rounded-xl border border-white/10">
                <p className="text-xs text-amber-300 font-serif font-bold mb-2">
                  Sélection de la vue d'origine pour projection 360° :
                </p>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {santaCruzGalleryItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`shrink-0 relative w-24 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                        (currentPage % santaCruzGalleryItems.length) === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                          : 'border-white/10 hover:border-white/40 opacity-70'
                      }`}
                    >
                      <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] text-center font-mono py-0.5 text-white truncate px-1">
                        Vue {idx + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
