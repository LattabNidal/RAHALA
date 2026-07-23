import React, { useState } from 'react';
import { FileText, Download, X, Eye, Award, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, MapPin, Building2, ShieldCheck, Compass, Image as ImageIcon } from 'lucide-react';

const djemilaFolderModules = import.meta.glob('/src/assets/images/Amphithéâtre  Arc de Djemila (Cuicul)/*.{webp,jpg,JPG,jpeg,png}', { eager: true, import: 'default' });
const djemilaImagesList = Object.values(djemilaFolderModules) as string[];

const primaryDjemilaPhoto = djemilaImagesList.find(img => img.includes('52664290936') || img.includes('site_0191') || img.includes('theatre-djemila')) 
  || djemilaImagesList[0] 
  || '/src/assets/images/Amphithéâtre  Arc de Djemila (Cuicul)/theatre-djemila-1024x576.webp';

export const djemilaGalleryPhotos = [
  {
    id: 1,
    src: djemilaImagesList.find(img => img.includes('theatre-djemila')) || primaryDjemilaPhoto,
    title: "Théâtre Romain Antique de Djémila (3 000 places)",
    category: "Théâtre & Monuments",
    desc: "Superbe théâtre romain adossé à la pente naturelle de la colline, édifié sous le règne d'Antonin le Pieux, offrant une acoustique exceptionnelle."
  },
  {
    id: 2,
    src: djemilaImagesList.find(img => img.includes('52664290936')) || primaryDjemilaPhoto,
    title: "Arc de Triomphe de Caracalla & Place Sévérienne",
    category: "Arc & Forum",
    desc: "Monumental arc de triomphe érige en l'an 216 par la colonie de Cuicul en l'honneur de l'empereur Caracalla et de sa mère Julia Domna."
  },
  {
    id: 3,
    src: djemilaImagesList.find(img => img.includes('site_0191')) || primaryDjemilaPhoto,
    title: "Vue Panoramique du Site Archéologique de Cuicul (UNESCO N° 191)",
    category: "Vue d'Ensemble",
    desc: "Vue générale embrassant le forum antique, la basilique judiciaire, le capitole et le paysage montagneux de la petite Kabylie."
  },
  {
    id: 4,
    src: djemilaImagesList.find(img => img.includes('images (1)')) || djemilaImagesList[1] || primaryDjemilaPhoto,
    title: "Colonnes Flûtées & Vestiges des Cardo et Decumanus",
    category: "Architecture",
    desc: "Artères pavées de dalles calcaires bordées de portiques à colonnes corinthiennes, témoignant du plan d'urbanisme romain adapté au relief."
  },
  {
    id: 5,
    src: djemilaImagesList.find(img => img.includes('images (2)')) || djemilaImagesList[2] || primaryDjemilaPhoto,
    title: "Temple des Septimes & Forum Nouveau (Sévérien)",
    category: "Temples & Cultes",
    desc: "Façade monumentale du temple dédié à la dynastie des Sévères, dominant la vaste place publique dallée de Cuicul."
  },
  {
    id: 6,
    src: djemilaImagesList.find(img => img.includes('images.webp')) || djemilaImagesList[0] || primaryDjemilaPhoto,
    title: "Ensemble Baptistère Paléochrétien & Mosaïques",
    category: "Patrimoine Chrétien",
    desc: "Complexe de basiliques chrétiennes du IVe siècle abritant la cuve baptismale circulaire et le célèbre musée des mosaïques romaines."
  }
];

interface DjemilaDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
}

export const DjemilaDocumentModal: React.FC<DjemilaDocumentModalProps> = ({
  isOpen,
  onClose,
  siteName = "Amphithéâtre & Arc de Djemila (Cuicul)"
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'document' | 'photos' | 'technical'>('document');
  const [activeLightbox, setActiveLightbox] = useState<typeof djemilaGalleryPhotos[0] | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `======================================================================\n` +
      `ORGANISATION DES NATIONS UNIES POUR L'ÉDUCATION, LA SCIENCE ET LA CULTURE\n` +
      `UNESCO - CONVENTION DU PATRIMOINE MONDIAL N° 191\n` +
      `======================================================================\n\n` +
      `BIEN : DJÉMILA (L'ANTIQUE CUICUL)\n` +
      `LOCALISATION : Commune de Djemila, Wilaya de Sétif, Algérie\n` +
      `INSCRIPTION SUR LA LISTE DU PATRIMOINE MONDIAL : 1982 (CRITÈRES iii, iv)\n` +
      `SUPERFICIE : 30 hectares\n\n` +
      `--- 1. SYNTHÈSE HISTORIQUE ET URBANISTIQUE ---\n\n` +
      `Situé à 900 mètres d'altitude sur un éperon rocheux entre deux oueds au cœur des montagnes de Kabylie, Djémila (Cuicul) est une colonie militaire romaine créée à la fin du Ier siècle (96 apr. J.-C.) sous le règne de Nerva.\n\n` +
      `Elle offre l'un des exemples les plus achevés d'adaptation de l'urbanisme romain classique à un relief montagneux complexe.\n\n` +
      `--- 2. MONUMENTS MAJEURS ---\n\n` +
      `• ARC DE CARACALLA (216 apr. J.-C.) : Porte monumentale ouvrant la voie vers Sitifis (Sétif).\n` +
      `• THÉÂTRE ROMAIN (IIe siècle) : Édifice adossé à la colline pouvant accueillir 3 000 spectateurs.\n` +
      `• FORUM SÉVÉRIEN & TEMPLE DES SEPTIMES : Place monumentale et temple dynastique.\n` +
      `• COMPLEXE PALÉOCHRÉTIEN : Deux basiliques et un baptistère à coupole conservé en parfait état.\n` +
      `• MUSÉE DES MOSAÏQUES : Collection exceptionnelle (Mosaïque de l'Âne sauvage, Bacchus, Asclépios).\n\n` +
      `--- 3. CRITÈRES D'INSCRIPTION UNESCO ---\n\n` +
      `• Critère (iii) : Témoignage exceptionnel sur la civilisation romaine en Afrique du Nord.\n` +
      `• Critère (iv) : Exemple remarquable d'ensemble architectural combinant l'art romain et chrétien.\n\n` +
      `DOCUMENT CERTIFIÉ ET ARCHIVÉ PAR L'OGEBC & L'UNESCO • RÉPUBLIQUE ALGÉRIENNE`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "UNESCO_Rapport_Officiel_Djemila_Cuicul_191.txt";
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
                UNESCO_Rapport_Officiel_Djemila_Cuicul_N191.pdf
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Patrimoine Mondial UNESCO • République Algérienne Démocratique et Populaire
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
              <span className="hidden sm:inline">Télécharger Rapport</span>
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
        <div className="bg-[#242424] border-b border-white/5 px-4 py-2 flex space-x-2 space-x-reverse text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'document' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Document Certifié UNESCO N° 191</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'photos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon size={13} />
            <span>Galerie Photographique d'Époque (6 Clichés)</span>
          </button>

          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'technical' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={13} />
            <span>Fiche Technique & Cartographique</span>
          </button>
        </div>

        {/* Modal View Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#121212] flex justify-center">
          
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
                        LISTE DU PATRIMOINE MONDIAL
                      </h1>
                      <p className="text-xs font-sans font-bold text-amber-800 uppercase tracking-wider mt-0.5">
                        ORGANISATION DES NATIONS UNIES POUR L'ÉDUCATION, LA SCIENCE ET LA CULTURE
                      </p>
                    </div>
                    <div className="text-right font-mono text-xs border-2 border-gray-900 p-2 font-bold bg-amber-50/50">
                      N° 191 (1982)
                    </div>
                  </div>

                  {/* Identification Box */}
                  <div className="bg-amber-50/40 border border-amber-200 p-4 font-sans text-xs space-y-2">
                    <h2 className="font-bold font-serif text-sm border-b border-amber-200 pb-1 text-amber-900">
                      IDENTIFICATION OFFICIELLE DU BIEN
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                      <div><strong className="text-gray-900">Bien désigné :</strong> Djémila (Cuicul)</div>
                      <div><strong className="text-gray-900">Localisation :</strong> Djemila, Wilaya de Sétif</div>
                      <div><strong className="text-gray-900">État Partie :</strong> Algérie 🇩🇿</div>
                      <div><strong className="text-gray-900">Date d'inscription :</strong> Décembre 1982</div>
                    </div>
                  </div>

                  {/* Primary Featured Photo */}
                  <div className="my-4 border border-gray-300 p-2 bg-white rounded shadow-sm">
                    <img 
                      src={primaryDjemilaPhoto} 
                      alt="Théâtre et Arc de Djémila" 
                      className="w-full h-64 object-cover rounded"
                    />
                    <p className="text-[10px] font-sans text-gray-500 italic mt-1.5 text-center">
                      Document Officiel UNESCO N° 191 : Vue d'ensemble du site de Cuicul et de son théâtre antique.
                    </p>
                  </div>

                  {/* Brève Synthèse */}
                  <div>
                    <h2 className="font-bold font-sans text-sm text-gray-900 uppercase border-b border-gray-300 pb-1 mb-2">
                      SYNTHÈSE HISTORIQUE & VALEUR UNIVERSELLE EXCEPTIONNELLE
                    </h2>
                    <p className="text-justify italic text-gray-800 leading-relaxed bg-amber-50/30 p-3 border-l-4 border-amber-600">
                      « Situé à 900 m d'altitude dans les montagnes de la petite Kabylie, le site de Djémila (l'antique Cuicul) comporte un ensemble remarquable de ruines romaines, avec son forum, ses temples, ses basiliques, ses arcs de triomphe et ses maisons. C'est un exemple marquant d'adaptation de l'architecture romaine à un environnement montagneux. »
                    </p>
                  </div>

                  {/* Description Détallée */}
                  <div className="space-y-3 text-gray-800 font-sans text-xs">
                    <p className="text-justify">
                      Fondée vers 96 apr. J.-C. sous le règne de l'empereur Nerva comme poste militaire défensif, Cuicul s'est développée au fil des siècles jusqu'à devenir une florissante cité commerçante d'Afrique du Nord.
                    </p>
                    <p className="text-justify">
                      Sous les dynasties des Antonins puis des Sévères, la ville franchit ses limites originelles pour créer le Forum Nouveau (Place Sévérienne) au IIIe siècle, dominé par le monumental Arc de Caracalla et le Temple de la famille des Sévères.
                    </p>
                    <p className="text-justify">
                      Au IVe siècle, la cité adopte le christianisme et se dote d'un quartier paléochrétien comprenant deux basiliques et un baptistère circulaire conservé avec sa coupole d'origine.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Patrimoine Mondial N° 191</span>
                    <span>Page 1 de 3</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b border-gray-400 pb-2">
                    <h2 className="font-bold font-sans text-base text-gray-900 uppercase">
                      DESCRIPTION DES MONUMENTS MAJEURS DE CUICUL
                    </h2>
                  </div>

                  {/* Monuments list */}
                  <div className="space-y-4 font-sans text-xs">
                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">
                        1. L'Arc de Triomphe de Caracalla (216 apr. J.-C.)
                      </h3>
                      <p className="text-gray-800 text-justify">
                        Haut de 12,50 mètres, cet arc à baie unique ouvrait la route vers Sitifis (Sétif). Couronné par trois paires de colonnes corinthiennes dégagées, il porte des dédicaces à l'empereur Caracalla et à sa mère Julia Domna.
                      </p>
                    </div>

                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">
                        2. Le Théâtre Romain (IIe siècle)
                      </h3>
                      <p className="text-gray-800 text-justify">
                        Construit hors des murs de la cité originelle dans le flanc de la colline, ce théâtre de 3 000 places conserve sa cavea, son orchestra et les fondations de son mur de scène (scaenae frons).
                      </p>
                    </div>

                    <div className="p-3 bg-[#f5f2ed] border-l-4 border-gray-800">
                      <h3 className="font-bold text-gray-900 mb-1">
                        3. Le Baptistère & Complexe Paléochrétien
                      </h3>
                      <p className="text-gray-800 text-justify">
                        L'un des mieux préservés du monde méditerranéen, comportant une cuve baptismale circulaire dallée de mosaïques polycromes protégée par un ciborium sous dôme.
                      </p>
                    </div>
                  </div>

                  {/* Musée des Mosaïques */}
                  <div className="bg-amber-50/50 p-4 border border-amber-200 font-sans text-xs space-y-2">
                    <h3 className="font-bold font-serif text-sm text-amber-900 border-b border-amber-200 pb-1">
                      LE MUSÉE ET LA COLLECTION DE MOSAÏQUES
                    </h3>
                    <p className="text-gray-800 text-justify">
                      Le Musée du site de Djémila conserve des centaines de mètres carrés de mosaïques romaines exceptionnellement bien conservées qui couvraient le sol des riches demeures (Maison de Bacchus, Maison de l'Âne Sauvage, Villa de Castorius).
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Patrimoine Mondial N° 191</span>
                    <span>Page 2 de 3</span>
                  </div>
                </div>
              )}

              {/* PAGE 3 CONTENT */}
              {currentPage === 3 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2 flex justify-between items-center">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      CRITÈRES UNESCO ET RAPPORT DE CONSERVATION
                    </h2>
                    <span className="font-mono text-[10px] bg-gray-200 px-2 py-0.5 rounded">ICOMOS 1982</span>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <div className="p-3 bg-gray-100 border border-gray-300 font-mono text-[11px] leading-relaxed">
                      <p><strong>CRITÈRE (iii) :</strong> Djémila apporte un témoignage exceptionnel sur une civilisation disparue, illustrant la synthèse réussie entre la culture romaine et le milieu montagneux berbère d'Afrique du Nord.</p>
                    </div>

                    <div className="p-3 bg-gray-100 border border-gray-300 font-mono text-[11px] leading-relaxed">
                      <p><strong>CRITÈRE (iv) :</strong> Le site offre un exemple remarquable d'un ensemble architectural illustrant des périodes significatives de l'histoire humaine, depuis la Rome impériale des Antonins jusqu'à l'ère paléochrétienne.</p>
                    </div>

                    <div className="border-t border-gray-300 pt-3">
                      <h3 className="font-bold text-gray-900 mb-1">PROTECTION ET CADRE LÉGAL :</h3>
                      <p className="text-justify">
                        Le site est classé monument historique national par l'État algérien (Arrêté du 30 décembre 2009 / Loi 98-04 relative à la protection du patrimoine culturel) et géré par l'Office National de Gestion et d'Exploitation des Biens Culturels Protégés (OGEBC).
                      </p>
                    </div>
                  </div>

                  {/* Stamp Seal */}
                  <div className="pt-6 flex justify-end">
                    <div className="border-2 border-amber-800 text-amber-900 p-3 font-mono text-[10px] text-center uppercase tracking-widest rounded bg-amber-50">
                      ✓ RAPPORT OFFICIEL CERTIFIÉ<br />
                      PATRIMOINE MONDIAL UNESCO N° 191
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO • Patrimoine Mondial N° 191</span>
                    <span>Page 3 de 3</span>
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
                  Galerie Photographique d'Époque - Djémila (Cuicul)
                </h3>
                <p className="text-slate-400 text-xs">
                  Collection complète des clichés authentiques du site archéologique : Arc de Caracalla, théâtre romain, forum sévérien et colonnades.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {djemilaGalleryPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    onClick={() => setActiveLightbox(photo)}
                    className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition duration-200 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-48 overflow-hidden bg-black">
                      <img 
                        src={photo.src} 
                        alt={photo.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/70 text-amber-400 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/30">
                        {photo.category}
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {photo.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICAL DETAILS */}
          {activeTab === 'technical' && (
            <div className="w-full max-w-3xl space-y-6">
              <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-serif font-bold text-amber-400">
                    Fiche Technique & Cartographique de Cuicul (Djémila)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Données géographiques, structurales et archéologiques certifiées par le Ministère de la Culture.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Coordonnées GPS</span>
                    <p className="text-amber-300 font-bold">36.3192° N, 5.7364° E</p>
                  </div>

                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Altitude</span>
                    <p className="text-amber-300 font-bold">900 mètres (Plateau des Aurès/Kabylie)</p>
                  </div>

                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Période Historique</span>
                    <p className="text-amber-300 font-bold">Ier - VIe siècle apr. J.-C.</p>
                  </div>

                  <div className="bg-[#151515] p-3 rounded-lg border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase">Capacité du Théâtre</span>
                    <p className="text-amber-300 font-bold">3 000 spectateurs assis</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">
                    Axe d'Urbanisme & Monuments Associés
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 font-sans">
                    <li><strong className="text-white">Forum Ancien :</strong> Capitole, Curic, Basilique Judiciaire (100 apr. J.-C.).</li>
                    <li><strong className="text-white">Forum Nouveau (Sévérien) :</strong> Arc de Caracalla, Temple des Septimes (216 apr. J.-C.).</li>
                    <li><strong className="text-white">Quartier Chrétien :</strong> Basilique de Vitalis, Baptistère rond avec ciborium à coupole.</li>
                    <li><strong className="text-white">Thermes de Commodien :</strong> Superbe complexe thermal de 2 600 m².</li>
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
              <span className="text-amber-400 font-mono font-bold">{activeLightbox.title}</span>
              <button 
                onClick={() => setActiveLightbox(null)}
                className="p-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <img 
              src={activeLightbox.src} 
              alt={activeLightbox.title} 
              className="w-full h-[65vh] object-contain rounded bg-black"
            />
            <p className="text-xs text-slate-300 font-sans">
              {activeLightbox.desc}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
