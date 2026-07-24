import React, { useState } from 'react';
import { FileText, Download, X, Eye, Award, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BookOpen, ShieldCheck } from 'lucide-react';
import { LazyImage } from './rahala/LazyImage';

const santaCruzFolderModules = import.meta.glob('/src/assets/images/Santa Cruz Fort & Chapelle Notre-Dame du Salut/*.{webp,jpg,JPG,jpeg,png}', { eager: true, import: 'default' });
const santaCruzImagesList = Object.values(santaCruzFolderModules) as string[];

const primarySantaCruzPhoto = santaCruzImagesList.find(img => img.includes('Fort_Santa_Cruz_Oran1') || img.includes('Fort-de-Santa-Cruz') || img.includes('web-oran-santa-cruz')) 
  || santaCruzImagesList[0] 
  || '/src/assets/images/santa_cruz_oran_chapel_1784672157047.jpg';

const santaCruzGalleryItems = [
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'document' | 'photos' | 'plans'>('document');

  if (!isOpen) return null;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE\n` +
      `MINISTÈRE DE LA CULTURE — DIRECTION DU PATRIMOINE CULTURAEL\n\n` +
      `DOSSIER DE CLASSEMENT HISTORIQUE N° 1950-OR\n` +
      `SITE EMBLEMÁTIQUE: CHAPELLE NOTRE-DAME DU SALUT & FORT DE SANTA-CRUZ\n` +
      `LOCALISATION: Sommet du Mont Murdjadjo, Oran (Wahran), Algérie\n\n` +
      `--- SYNTHÈSE HISTORIQUE ET ARCHITECTURALE ---\n\n` +
      `1. L'ÉPIDÉMIE DE CHOLÉRA ET LA PREMIÈRE CHAPELLE (1849-1850):\n` +
      `En septembre 1849, une terrible épidémie de choléra s'abattit sur Oran (1 173 décès). Le général Pélissier et l'évêché décidèrent d'édifier une Vierge en contrebas du fort espagnol de Santa-Cruz. La première chapelle fut érigée par souscription en 1849-1850, bénie le 9 mai 1850.\n\n` +
      `2. LA TOUR ET LA STATUE EN BRONZE (1873-1876):\n` +
      `En 1873, un clocher monumental fut conçu par l'architecte Viala de Sorbier. La statue en bronze de 5 000 kg (moulée à Lyon sur celle de Fourvière) fut inaugurée le 6 décembre 1876 au sommet de la tour.\n\n` +
      `3. LE FORT MILITAIRE DU XVIe SIÈCLE (1577-1580):\n` +
      `Conçu par l'ingénieur italien Jacome Palearo Fratín sous le règne de Philippe II. Première pierre posée le 3 mai 1577. Chapelle carrée originelle attribuée à Leonardo Turriano (1594).\n\n` +
      `4. RÈGLEMENTATION ET CLASSEMENT:\n` +
      `Classé monument historique le 6 octobre 1950 (Loi de protection du patrimoine). La montagne du Murdjadjo est également classée site naturel protégé.\n\n` +
      `ARCHIVES MUNICIPALES ET DIOCÉSAINES D'ORAN • ÉTUDE USTO / UNIV. DE MALAGA`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "Dossier_Officiel_Santa_Cruz_Chapelle_Oran.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1e1e1e] text-slate-100 border border-amber-500/40 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Document Header Toolbar */}
        <div className="bg-[#2a2a2a] border-b border-white/10 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 space-x-reverse min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              <Award size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="font-mono font-bold text-amber-400 text-xs sm:text-sm truncate">
                Etude_Historique_Chapelle_Santa_Cruz_Oran.pdf
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Archives Historiques d'Oran • Dr. D. Senhadji (USTO) & Dr. A. Bravo-Nieto
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
            <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10 font-mono text-[11px]">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer"
                title="Page précédente"
              >
                <ChevronLeft size={14} />
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
                <ChevronRight size={14} />
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
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'document' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Document d'Étude & Archives</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'photos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Galerie Photographique du Site</span>
          </button>
        </div>

        {/* Content Viewer Area */}
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
                      UNIVERSITÉ DES SCIENCES ET DE LA TECHNOLOGIE MOHAMED BOUDIAF (USTO, ORAN)
                    </p>
                    <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-900 mt-1">
                      UN SITE EMBLEMÁTIQUE DE LA VILLE D'ORAN : LA CHAPELLE DE SANTA-CRUZ
                    </h1>
                    <p className="text-xs font-sans text-gray-600 mt-1 italic">
                      Par Dalila SENHADJI, Architecte, enseignante-chercheure, Département d'Architecture
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-amber-50/60 border-l-4 border-amber-700 p-4 font-sans text-xs space-y-2 text-gray-800">
                    <h2 className="font-bold font-serif text-sm text-amber-950 uppercase border-b border-amber-200 pb-1">
                      CONTEXTE HISTORIQUE & L'ÉPIDÉMIE DE CHOLÉRA DE 1849
                    </h2>
                    <p className="text-justify italic">
                      « En 1849, une terrible épidémie de choléra s’abat sur Oran et ses environs. Du 14 au 31 octobre, il y eut 1 173 décès. L’absence de pluies pousse le général Pélissier à solliciter l’évêché afin d’installer sur la montagne, en contrebas du fort espagnol de Santa-Cruz, une statue de la Vierge qui se chargera de jeter le choléra à la mer. »
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
                      Vue sur la chapelle Notre-Dame du Salut, la tour monumentale et le fort de Santa-Cruz sur le mont Murdjadjo.
                    </p>
                  </div>

                  {/* Text sections */}
                  <div className="space-y-3 font-sans text-xs text-gray-800">
                    <h3 className="font-bold font-serif text-sm text-gray-900 border-b border-gray-300 pb-1">
                      1.1 La Construction de la Première Chapelle (1849 – 1850)
                    </h3>
                    <p className="text-justify">
                      Une modeste chapelle commémorative est édifiée par souscriptions publiques en 1849-1850. Le terrain, d'une superficie de 560 m², situé sur un emplacement stratégique offrant une vue panoramique sur la mer et la baie de Mers-El-Kébir, est cédé par le Ministère de la Guerre le 20 janvier 1850.
                    </p>
                    <p className="text-justify">
                      L'édifice est solennellement béni le 9 mai 1850. La voûte initiale, construite dans l'urgence des débuts de la colonisation, s'effondre peu après avant d'être rebâtie en 1851.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>Archives Historiques d'Oran • Monument Classé</span>
                    <span>Page 1 de 4</span>
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

        </div>

      </div>
    </div>
  );
};
