import React, { useState } from 'react';
import { FileText, Download, X, Eye, CheckCircle2, ShieldAlert, Award, Search, ZoomIn, ZoomOut, Printer, Bookmark, MapPin, Building, ChevronLeft, ChevronRight } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate text download or simulate file download
    const element = document.createElement("a");
    const file = new Blob([
      `UNESCO - LISTE DU PATRIMOINE MONDIAL N° 555\n\n` +
      `BIEN PROPOSÉ: Casbah d'Alger\n` +
      `LIEU: Ville d'Alger, Algérie\n` +
      `DATE: 6 mars 1990 (Classification UNESCO 1992)\n\n` +
      `BRÈVE SYNTHÈSE:\n` +
      `Dans l’un des plus beaux sites maritimes de la Méditerranée, surplombant les îlots où un comptoir carthaginois fut installé dès le IVe siècle av. J.-C., la Casbah constitue un type unique de médina, ou ville islamique. Lieu de mémoire autant que d’histoire, elle comprend des vestiges de la citadelle, des mosquées anciennes, des palais ottomans, ainsi qu’une structure urbaine traditionnelle associée à un grand sens de la communauté.\n\n` +
      `CRITÈRES D'INSCRIPTION:\n` +
      `- Critère (ii) : Influence considérable sur l'architecture et la planification urbaine en Afrique du Nord, Andalousie et Afrique sub-saharienne durant les XVIe et XVIIe siècles.\n` +
      `- Critère (v) : Exemple éminent d'un habitat humain traditionnel représentatif de la culture musulmane méditerranéenne.\n\n` +
      `INTÉGRITÉ ET AUTHENTICITÉ:\n` +
      `Forme et conception (trame urbaine très dense), matériaux traditionnels (briques de terre crue, chaux, pierre et bois).`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "UNESCO_Dossier_Officiel_Casbah_Alger_555.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1e1e1e] text-slate-100 border border-amber-500/30 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* PDF Header Toolbar */}
        <div className="bg-[#2d2d2d] border-b border-white/10 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 space-x-reverse min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              <Award size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="font-mono font-bold text-amber-400 text-xs sm:text-sm truncate">
                UNESCO_Dossier_N555_Casbah_dAlger.pdf
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Patrimoine Mondial de l'Humanité • République Algérienne Démocratique et Populaire
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
                {currentPage} / 3
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
                disabled={currentPage === 3}
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
        <div className="bg-[#242424] border-b border-white/5 px-4 py-2 flex space-x-2 space-x-reverse text-xs font-mono">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'document' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Document Certifié ICOMOS (Textes)</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'photos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Galerie Photographique d'Époque</span>
          </button>
        </div>

        {/* PDF Document Canvas View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#121212] flex justify-center">
          
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
                        LISTE DU PATRIMOINE MONDIAL
                      </h1>
                      <p className="text-xs font-sans font-bold text-amber-800 uppercase tracking-wider mt-0.5">
                        ORGANISATION DES NATIONS UNIES POUR L'ÉDUCATION, LA SCIENCE ET LA CULTURE
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs border-2 border-gray-900 p-2 font-bold bg-amber-50/50">
                      N° 555
                    </div>
                  </div>

                  {/* Identification Box */}
                  <div className="bg-amber-50/40 border border-amber-200 p-4 font-sans text-xs space-y-2">
                    <h2 className="font-bold font-serif text-sm border-b border-amber-200 pb-1 text-amber-900">
                      A) IDENTIFICATION DU BIEN
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                      <div><strong className="text-gray-900">Bien proposé :</strong> La Casbah d'Alger</div>
                      <div><strong className="text-gray-900">Lieu :</strong> Ville d'Alger (Wilaya d'Alger)</div>
                      <div><strong className="text-gray-900">État Partie :</strong> Algérie 🇩🇿</div>
                      <div><strong className="text-gray-900">Date d'inscription :</strong> 6 mars 1990 (UNESCO 1992)</div>
                    </div>
                  </div>

                  {/* High Resolution Primary Photo */}
                  <div className="my-4 border border-gray-300 p-2 bg-white rounded shadow-sm">
                    <img 
                      src="/src/assets/images/casbah_d_alger/site_0565_0017-1000-1481-20140721144417.webp" 
                      alt="Casbah d'Alger - Vue panoramique officielle" 
                      className="w-full h-64 object-cover rounded"
                    />
                    <p className="text-[10px] font-sans text-gray-500 italic mt-1.5 text-center">
                      Document Officiel UNESCO N° 555 : Site authentique et architecture séculaire de la Casbah d'Alger.
                    </p>
                  </div>

                  {/* Brève Synthèse */}
                  <div>
                    <h2 className="font-bold font-sans text-sm text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                      VALEUR UNIVERSELLE EXCEPTIONNELLE — BRÈVE SYNTHÈSE
                    </h2>
                    <p className="text-justify italic text-gray-800 leading-relaxed bg-amber-50/30 p-3 border-l-4 border-amber-600">
                      « Dans l’un des plus beaux sites maritimes de la Méditerranée, surplombant les îlots où un comptoir carthaginois fut installé dès le IVe siècle av. J.-C., la Casbah constitue un type unique de médina , ou ville islamique. Lieu de mémoire autant que d’histoire, elle comprend des vestiges de la citadelle, des mosquées anciennes, des palais ottomans, ainsi qu’une structure urbaine traditionnelle associée à un grand sens de la communauté. »
                    </p>
                  </div>

                  {/* Description Détallée */}
                  <div className="space-y-3 text-gray-800 font-sans text-xs">
                    <p className="text-justify">
                      La Casbah d'Alger apparaît comme un exemple significatif de ville historique maghrébine qui eut une grande influence sur l'urbanisme dans la partie occidentale de la Méditerranée et en Afrique sub-saharienne.
                    </p>
                    <p className="text-justify">
                      Situé sur la côte méditerranéenne, le site fut habité au moins dès le VIe siècle avant notre ère quand un comptoir phénicien y fut installé. Le terme Casbah, qui désignait à l'origine le point culminant de la médina de l'époque ziride, s'applique aujourd'hui à l'ensemble de la vieille ville d'El Djazair, dans les limites marquées par les remparts d'époque ottomane édifiés dès la fin du XVIe siècle.
                    </p>
                    <p className="text-justify">
                      Dans cet ensemble vivant où résident près de 50.000 personnes, se conservent encore de très intéressantes habitations traditionnelles, palais, hammams, mosquées et divers souks, dont la forme urbaine représente le témoignage d'une stratification de plusieurs tendances.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Patrimoine Mondial N° 555</span>
                    <span>Page 1 de 3</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b border-gray-400 pb-2">
                    <h2 className="font-bold font-sans text-base text-gray-900 uppercase">
                      CRITÈRES D'INSCRIPTION & ÉVALUATION DU BIEN (2009 / 1990)
                    </h2>
                  </div>

                  {/* Critères */}
                  <div className="space-y-4 font-sans text-xs">
                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Critère (ii) : Influence sur l'Architecture & l'Urbanisme
                      </h3>
                      <p className="text-gray-800 text-justify">
                        La Casbah d'Alger a exercé une influence considérable sur l'architecture et la planification urbaine en Afrique du Nord, en Andalousie et en Afrique sub-saharienne durant les XVIe et XVIIe siècles. Ces échanges se manifestent par le caractère spécifique de son habitat et par la densité de sa stratification urbaine.
                      </p>
                    </div>

                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">
                        Critère (v) : Exemple Éminent d'Habitat Humain Traditionnel
                      </h3>
                      <p className="text-gray-800 text-justify">
                        La Casbah d'Alger est un exemple éminent d'un habitat humain traditionnel représentatif de la culture musulmane profondément méditerranéenne, synthèse de nombreuses traditions. Les vestiges de la citadelle, des mosquées anciennes, des palais ottomans, ainsi qu'une structure urbaine traditionnelle associée à un grand sens de la communauté sont les témoins de cette culture.
                      </p>
                    </div>
                  </div>

                  {/* Intégrité & Authenticité */}
                  <div className="space-y-3 font-sans text-xs pt-2">
                    <h3 className="font-bold font-serif text-sm text-gray-900 border-b border-gray-300 pb-1">
                      INTÉGRITÉ & AUTHENTICITÉ
                    </h3>
                    
                    <div className="text-gray-800 space-y-2">
                      <p>
                        <strong>Intégrité :</strong> Malgré les mutations et les aléas sismiques qu'elle a subis, la Casbah d'Alger conserve toujours son intégrité. Dans leur ensemble, les caractères esthétiques, les matériaux utilisés et les éléments architecturaux gardent leurs aspects originaux qui expriment les valeurs ayant prévalu au classement du site en 1992.
                      </p>
                      <p>
                        <strong>Authenticité :</strong> Les attributs de la Valeur universelle exceptionnelle sont maintenus. La Casbah témoigne d'une authenticité remarquable, aussi bien au niveau de la forme et de la conception (trame urbaine très dense), des matériaux de construction (briques en terre crue, enduits de terre et à la chaux, pierre et bois) que de l'utilisation.
                      </p>
                    </div>
                  </div>

                  {/* Protection & Gestion */}
                  <div className="bg-amber-50/50 p-4 border border-amber-200 font-sans text-xs space-y-2">
                    <h3 className="font-bold font-serif text-sm text-amber-900 border-b border-amber-200 pb-1">
                      PROTECTION ET CADRE JURIDIQUE
                    </h3>
                    <p className="text-gray-800 text-justify">
                      La Casbah d'Alger fut classée site historique national en novembre 1991 et secteur sauvegardé en 2003. Le cadre juridique comprend les lois 98.04 (protection du patrimoine culturel) et le Plan de sauvegarde et de mise en valeur (PPSMVSS, décret n° 324-2003) géré par la Direction de la Culture de la Wilaya d'Alger et l'OGEBC.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Patrimoine Mondial N° 555</span>
                    <span>Page 2 de 3</span>
                  </div>
                </div>
              )}

              {/* PAGE 3 CONTENT */}
              {currentPage === 3 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2 flex justify-between items-center">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      RAPPORT D'ÉVALUATION DE L'ICOMOS (NOVEMBRE 1991)
                    </h2>
                    <span className="font-mono text-[10px] bg-gray-200 px-2 py-0.5 rounded">DOCUMENT D'ARCHIVE</span>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <div className="p-3 bg-gray-100 border border-gray-300 font-mono text-[11px] leading-relaxed">
                      <p><strong>B) RECOMMANDATION DE L'ICOMOS :</strong></p>
                      <p>Que l'inscription de ce bien culturel sur la Liste du Patrimoine mondial soit confirmée avec l'engagement des autorités algériennes à l'égard de la conservation de la Casbah.</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">C) OBSERVATIONS HISTORIQUES ET ARCHITECTURALES :</h3>
                      <p className="text-justify mb-2">
                        Accueilli à bras ouverts par la population locale, un corsaire turc — Khaïr al-Din — installe sa capitale à Alger (1516) et soumet une grande partie du littoral algérien au sultan ottoman.
                      </p>
                      <p className="text-justify">
                        Dans la ville se conjugue la science de l'architecture militaire turque avec les traditions architecturales arabe-méditerranéennes (habitations ordonnées autour d'un patio central et surmontées de terrasses).
                      </p>
                    </div>

                    <div className="border-t border-gray-300 pt-3">
                      <h3 className="font-bold text-gray-900 mb-1">D) JUSTIFICATION DU CLASSEMENT :</h3>
                      <p className="text-justify">
                        Un très intelligent plan de réaménagement de la Casbah est en cours pour réinstaller le confort moderne sans bouleverser l'urbanisme traditionnel, et conserver ce précieux témoin d'événements historiques parmi les plus marquants de l'histoire du peuple algérien.
                      </p>
                    </div>
                  </div>

                  {/* Stamp Seal */}
                  <div className="pt-6 flex justify-end">
                    <div className="border-2 border-amber-800 text-amber-900 p-3 font-mono text-[10px] text-center uppercase tracking-widest rounded bg-amber-50">
                      ✓ DOCUMENT OFFICIEL CERTIFIÉ<br />
                      ORGANISATION UNESCO • 1990/1992
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Patrimoine Mondial N° 555</span>
                    <span>Page 3 de 3</span>
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
                  Photographies Authentiques de la Casbah d'Alger (Dossier UNESCO N° 555)
                </h3>
                <p className="text-slate-400 text-xs">
                  Collection complète des clichés authentiques certifiés : panorama des terrasses, ruelles en escalier, patios ottomans, fontaines zellige et passages sous voûte (sabat).
                </p>
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
                  <div key={idx} className="bg-[#1e1e1e] p-2 rounded-xl border border-white/10 space-y-2">
                    <img src={item.src} alt={item.label} className="w-full h-56 object-cover rounded-lg" />
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
