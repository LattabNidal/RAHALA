import React, { useState } from 'react';
import { FileText, Download, X, Eye, Award, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Compass, ShieldCheck, Trees, Layers, MapPin } from 'lucide-react';

interface TassiliDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName?: string;
}

export const TassiliDocumentModal: React.FC<TassiliDocumentModalProps> = ({
  isOpen,
  onClose,
  siteName = "Parc National du Tassili n'Ajjer (Djanet, Sahara)"
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'document' | 'technical' | 'rockart' | 'biodiversity' | 'photos'>('document');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [activeLightbox, setActiveLightbox] = useState<typeof tassiliGalleryPhotos[0] | null>(null);

  if (!isOpen) return null;

  const tassiliGalleryPhotos = [
    {
      id: 1,
      src: '/src/assets/images/tassili_erg_dunes_1784674389237.jpg',
      title: "Dunes de l'Erg d'Admer & Arches de Grès (Djanet)",
      category: "Erg & Canyons",
      desc: "Paysage saharien spectaculaire associant des dunes dorées à des falaises de grès sculptées par l'érosion éolienne au coucher du soleil."
    },
    {
      id: 2,
      src: '/src/assets/images/tassili_reg_desert_1784674407062.jpg',
      title: "Le Reg Saharien & Pics Lointains",
      category: "Géologie",
      desc: "Désert de pierres recouvert de galets basaltiques sombres et de végétation xérophile avec les pics du plateau se découpant à l'horizon."
    },
    {
      id: 3,
      src: '/src/assets/images/tassili_art_dancers_1784674422643.jpg',
      title: "Peinture Rupestre : Le Cercle des Danseurs",
      category: "Art Rupestre",
      desc: "Fresque néolithique peinte à l'ocre rouge représentant un groupe d'hommes et de femmes célébrant un rituel sacré dans une grotte."
    },
    {
      id: 4,
      src: '/src/assets/images/tassili_folded_rocks_1784674435944.jpg',
      title: "Strates Géologiques Plissées du Tassili",
      category: "Géologie",
      desc: "Formations de roches plissées précambriennes témoignant des forces tectoniques et géologiques majeures survenues au Paléozoïque."
    },
    {
      id: 5,
      src: '/src/assets/images/tassili_rock_pillars_1784674449646.jpg',
      title: "Colonnes & Tour-Piliers de Grès Monumentales",
      category: "Géologie",
      desc: "Aiguilles rocheuses colossales s'élevant vers le ciel bleu azur du Sahara, emblèmes géomorphologiques du Tassili n'Ajjer."
    },
    {
      id: 6,
      src: '/src/assets/images/tassili_canyon_gorge_1784674464805.jpg',
      title: "Gorge & Canyon Vertigineux du Plateau",
      category: "Erg & Canyons",
      desc: "Aven et canyon rocheux profond découpé dans le grès quartzeux, vestige des réseaux hydrographiques du Sahara vert préhistorique."
    },
    {
      id: 7,
      src: '/src/assets/images/tassili_art_figures_1784674477805.jpg',
      title: "Peinture Rupestre : Personnages aux Coiffures Cérémoniales",
      category: "Art Rupestre",
      desc: "Chef-d'œuvre de la période Bovidienne/Têtes Rondes montrant deux figures humaines aux ornements rituels et coiffures blanches peintes."
    },
    {
      id: 8,
      src: '/src/assets/images/tassili_art_giraffe_1784674491289.jpg',
      title: "Gravure & Peinture Rupestre : La Girafe de l'Ocre",
      category: "Art Rupestre",
      desc: "Détail d'une peinture à l'ocre rouge d'une girafe au cou tacheté, preuve de la faune sauvage abondante traversant le Tassili il y a 8 000 ans."
    },
    {
      id: 9,
      src: '/src/assets/images/tassili_tarout_tree_1784674506915.jpg',
      title: "Le Cyprès du Tassili (Tarout - Cupressus dupreziana)",
      category: "Biodiversité",
      desc: "Spécimen millénaire de cyprès endémique du Tassili (moins de 230 arbres sauvages répertoriés au monde), véritable fossile vivant."
    },
    {
      id: 10,
      src: '/src/assets/images/tassili_oasis_canyon_1784674520880.jpg',
      title: "Vallée de Canyon, Oasis & Enclos Nomades",
      category: "Biodiversité",
      desc: "Vue aérienne d'une vallée verdoyante avec palmeraie de wadi et enclos pastoraux traditionnels touaregs nichés dans le canyon."
    },
    {
      id: 11,
      src: '/src/assets/images/tassili_stone_forest_1784674536111.jpg',
      title: "Sefar : La Cité de Pierre & La Forêt de Rochers",
      category: "Géologie",
      desc: "Vue panoramique de Sefar, plus grande cité de pierre au monde, abritant le plus grand musée à ciel ouvert de l'humanité."
    }
  ];

  const filteredPhotos = selectedCategory === 'Tous'
    ? tassiliGalleryPhotos
    : tassiliGalleryPhotos.filter(p => p.category === selectedCategory);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `========================================================================\n` +
      `UNESCO - PATRIMOINE MONDIAL DE L'HUMANITÉ N° 179\n` +
      `REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE\n` +
      `MINISTÈRE DE LA CULTURE — DIRECTION DU PATRIMOINE CULTUREL\n` +
      `OFFICE NATIONAL DU PARC CULTUREL DU TASSILI N'AJJER (OPNT)\n` +
      `========================================================================\n\n` +
      `DOSSIER OFFICIEL D'INSCRIPTION & RAPPORT PÉRIODIQUE\n` +
      `NOM DU BIEN: Tassili n'Ajjer\n` +
      `LOCALISATION: Djanet & Illizi, Sahara Algérien (25.5°N / 9.0°E)\n` +
      `SUPERFICIE D'INSCRIPTION UNESCO: 7 200 000 ha (72 000 km²)\n` +
      `SUPERFICIE DU PARC CULTUREL (OPNT): 138 000 km²\n` +
      `DATE D'INSCRIPTION UNESCO: 1982 (Bien Mixte - Critères i, iii, vii, viii)\n` +
      `RÉSERVE DE BIOSPHÈRE (MAB): 1986\n\n` +
      `------------------------------------------------------------------------\n` +
      `1. DÉCLARATION DE VALEUR UNIVERSELLE EXCEPTIONNELLE (VUE)\n` +
      `------------------------------------------------------------------------\n` +
      `Brève synthèse:\n` +
      `Cet étrange paysage lunaire de grand intérêt géologique abrite l'un des plus importants ensembles d'art rupestre préhistorique du monde. Plus de 15 000 dessins et gravures permettent d'y suivre, depuis 10 000 av. J.-C. jusqu'aux premiers siècles de notre ère, les changements du climat, les migrations de la faune et l'évolution de la vie humaine aux confins du Sahara.\n\n` +
      `CRITÈRES D'INSCRIPTION UNESCO:\n` +
      `- Critère (i) [Art Rupestre]: Ensemble remarquable de peintures et gravures. Période des Têtes Rondes (pratiques magico-religieuses de 10 000 ans) et Période Bovidienne (réalisme esthétique naturaliste). Représentations de la domestication des chevaux et chameaux.\n` +
      `- Critère (iii) [Mémoire des Civilisations]: Couvre 10 000 ans d'histoire vivante et disparue, témoignant des changements climatiques, de la faune aquatique (hippopotames) et de la vie pastorale.\n` +
      `- Critère (vii) [Forêts de Rochers]: Grès érodés sculptés par l'eau puis le vent, créant un paysage lunaire découpé de canyons au contraste visuel spectaculaire.\n` +
      `- Critère (viii) [Histoire Géologique]: Unités cristallines précambriennes et sédimentaires gréseuses de grand intérêt paléogéographique et paléo-écologique.\n\n` +
      `------------------------------------------------------------------------\n` +
      `2. PATRIMOINE CULTUREL IMMATÉRIEL ASSOCIÉ (UNESCO)\n` +
      `------------------------------------------------------------------------\n` +
      `- L'Imzad: Pratiques et savoirs liés à l'Imzad des communautés touarègues (Inscrit UNESCO en 2013).\n` +
      `- La Sebeïba: Rituel et cérémonies de la Sebeïba dans l'oasis de Djanet (Inscrit UNESCO en 2014).\n` +
      `- Les 3 Ksour de Djanet: El Mihan, Adjahil, Zellouaz (Classés patrimoine national en 2018).\n\n` +
      `------------------------------------------------------------------------\n` +
      `3. ÉCOSYSTÈME ET ESPÈCES ÉNDÉMIQUES\n` +
      `------------------------------------------------------------------------\n` +
      `- Le Tarout (Cupressus dupreziana): Cyprès du Tassili rarissime dont certains spécimens sont millénaires.\n` +
      `- Faune emblématique: Mouflon à manchettes, Gazelle Dorcas, Guépard saharien.\n\n` +
      `------------------------------------------------------------------------\n` +
      `4. PROTECTION ET GESTION JURIDIQUE\n` +
      `------------------------------------------------------------------------\n` +
      `- Décret du 27 juillet 1972: Création du Parc National du Tassili.\n` +
      `- Arrêté du 30 septembre 1987: Classement des monuments historiques.\n` +
      `- Loi n° 98-04 du 15 juin 1998: Protection du patrimoine culturel (Statut de Parc Culturel).\n` +
      `- Décret exécutif n° 12-292 du 21 juillet 2012: Statut de l'OPNT (Établissement Public Administratif - EPA).\n` +
      `- Guide officiel obligatoire pour tout groupe de visiteurs dans le parc.\n`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "UNESCO_Dossier_Officiel_Tassili_nAjjer_179.txt";
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
                UNESCO_Dossier_N179_Tassili_nAjjer_Djanet.pdf
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Patrimoine Mondial Mixte (Culturel & Naturel) • République Algérienne • OPNT
              </p>
            </div>
          </div>

          {/* Navigation & Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
            {activeTab === 'document' && (
              <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10 font-mono text-[11px]">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer text-slate-300"
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
                  className="p-1 hover:bg-white/10 rounded disabled:opacity-30 cursor-pointer text-slate-300"
                  title="Page suivante"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            <div className="hidden md:flex items-center bg-black/40 rounded-lg p-1 border border-white/10 font-mono text-[11px]">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 25))}
                className="p-1 hover:bg-white/10 rounded cursor-pointer text-slate-300"
                title="Zoom arrière"
              >
                <ZoomOut size={14} />
              </button>
              <span className="px-2 text-slate-300">
                {zoomLevel}%
              </span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 25))}
                className="p-1 hover:bg-white/10 rounded cursor-pointer text-slate-300"
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
        <div className="bg-[#222222] border-b border-white/5 px-3 py-2 flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('document')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'document' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>1. Dossier UNESCO N° 179</span>
          </button>

          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'technical' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={13} />
            <span>2. Fiche Technique & OPNT</span>
          </button>

          <button
            onClick={() => setActiveTab('rockart')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'rockart' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={13} />
            <span>3. Art Rupestre (4 Périodes)</span>
          </button>

          <button
            onClick={() => setActiveTab('biodiversity')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'biodiversity' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trees size={13} />
            <span>4. Écosystème & Cyprès Tarout</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'photos' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>5. Galerie Photographique</span>
          </button>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#121212] flex justify-center">
          
          {/* TAB 1: DOSSIER OFFICIEL UNESCO */}
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
                      ORGANISATION DES NATIONS UNIES POUR L'ÉDUCATION, LA SCIENCE ET LA CULTURE (UNESCO)
                    </p>
                    <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-900 mt-1">
                      LISTE DU PATRIMOINE MONDIAL N° 179 : TASSILI N'AJJER
                    </h1>
                    <p className="text-xs font-sans text-gray-600 mt-1 italic">
                      Bien Mixte (Culturel & Naturel) Inscrit en 1982 • Superficie : 72 000 km² (Djanet, Sahara)
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-amber-50/60 border-l-4 border-amber-700 p-4 font-sans text-xs space-y-2 text-gray-800">
                    <h2 className="font-bold font-serif text-sm text-amber-950 uppercase border-b border-amber-200 pb-1">
                      BRÈVE SYNTHÈSE (UNESCO N° 179)
                    </h2>
                    <p className="text-justify leading-relaxed">
                      Cet étrange paysage lunaire de grand intérêt géologique abrite l’un des plus importants ensembles d’art rupestre préhistorique du monde. Plus de 15 000 dessins et gravures permettent d’y suivre, depuis 10 000 av. J.-C. jusqu’aux premiers siècles de notre ère, les changements du climat, les migrations de la faune et l’évolution de la vie humaine aux confins du Sahara. Le panorama de formations géologiques présente un intérêt exceptionnel avec ses « forêts de rochers » de grès érodé.
                    </p>
                    <p className="text-justify text-[11px] text-gray-700 pt-1">
                      Le Tassili n'Ajjer est un immense plateau situé au Sud-est de l'Algérie (Djanet) couvrant une superficie de 72 000 km². La densité exceptionnelle des peintures et gravures (découvertes en 1933) et les vestiges archéologiques (habitats, tumuli, enclos, matériel lithique et céramique) constituent des témoignages d'une valeur universelle exceptionnelle.
                    </p>
                  </div>

                  {/* Main Photo */}
                  <div className="my-4 border border-gray-300 p-2 bg-white rounded shadow-sm">
                    <img 
                      src="/src/assets/images/tassili_erg_dunes_1784674389237.jpg" 
                      alt="Tassili n'Ajjer Djanet Sahara" 
                      className="w-full h-64 object-cover rounded cursor-pointer hover:opacity-95 transition"
                      onClick={() => {
                        setActiveTab('photos');
                        setActiveLightbox(tassiliGalleryPhotos[0]);
                      }}
                    />
                    <p className="text-[10px] font-sans text-gray-500 italic mt-1.5 text-center">
                      Panorama sur les dunes de l'Erg d'Admer et les falaises de grès érodé du Tassili n'Ajjer (Djanet).
                    </p>
                  </div>

                  {/* Text sections */}
                  <div className="space-y-3 font-sans text-xs text-gray-800">
                    <h3 className="font-bold font-serif text-sm text-gray-900 border-b border-gray-300 pb-1 uppercase">
                      VALEUR UNIVERSELLE EXCEPTIONNELLE (CRITÈRES UNESCO)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                        <strong className="text-amber-900">Critère (i) — Art Rupestre Mondial :</strong>
                        <p className="text-gray-700 text-[10.5px] mt-1">
                          Ensemble remarquable de peintures et gravures. Les Têtes Rondes (pratiques magico-religieuses de 10 000 ans) et la période des Bovidés (réalisme esthétique naturaliste).
                        </p>
                      </div>
                      <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                        <strong className="text-amber-900">Critère (iii) — Mémoire des Civilisations :</strong>
                        <p className="text-gray-700 text-[10.5px] mt-1">
                          Couvre 10 000 ans d'histoire vivante et disparue, témoignant des changements climatiques, de la faune aquatique (hippopotames) et de la vie pastorale.
                        </p>
                      </div>
                      <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                        <strong className="text-amber-900">Critère (vii) — Forêts de Rochers :</strong>
                        <p className="text-gray-700 text-[10.5px] mt-1">
                          Grès érodés sculptés par l'eau puis le vent, créant un paysage lunaire découpé de canyons au contraste visuel spectaculaire.
                        </p>
                      </div>
                      <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                        <strong className="text-amber-900">Critère (viii) — Histoire Géologique :</strong>
                        <p className="text-gray-700 text-[10.5px] mt-1">
                          Unités cristallines précambriennes et gréseuses de grand intérêt paléogéographique, témoins de l'évolution biologique saharienne.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO N° 179 • République Algérienne</span>
                    <span>Page 1 de 4</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 */}
              {currentPage === 2 && (
                <div className="space-y-6 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b border-gray-400 pb-2">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      ART RUPESTRE ET ÉVOLUTION CHRONOLOGIQUE (+15 000 GRAVURES ET PEINTURES)
                    </h2>
                  </div>

                  <div className="space-y-4 font-sans text-xs text-gray-800">
                    <p className="text-justify">
                      L'art rupestre du Tassili n'Ajjer constitue la mémoire graphique la plus complète de l'Afrique du Nord préhistorique. Il se divise en 4 grandes périodes chronologiques :
                    </p>

                    <div className="grid grid-cols-1 gap-2 font-mono text-[11px]">
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                        <strong className="text-amber-950">1. Période des Têtes Rondes (8 000 à 6 000 av. J.-C.) :</strong>
                        <p className="font-sans text-gray-700 text-xs mt-0.5">
                          Figures humaines stylisées, divinités imposantes ("Le Grand Dieu de Sefar"), rituels sacrés aux pigments ocre et blancs.
                        </p>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                        <strong className="text-amber-950">2. Période Bovidienne (6 000 à 1 500 av. J.-C.) :</strong>
                        <p className="font-sans text-gray-700 text-xs mt-0.5">
                          Représentation de grands troupeaux de bovins, scènes de la vie pastorale quotidienne dans un Sahara alors luxuriant et verdoyant.
                        </p>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                        <strong className="text-amber-950">3. Période Chevaline / Équidienne (1 200 av. J.-C.) :</strong>
                        <p className="font-sans text-gray-700 text-xs mt-0.5">
                          Apparition du cheval et des chars de guerre, témoignant des échanges avec les civilisations méditerranéennes.
                        </p>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
                        <strong className="text-amber-950">4. Période Caméline (à partir du Ier siècle av. J.-C.) :</strong>
                        <p className="font-sans text-gray-700 text-xs mt-0.5">
                          Introduction du dromadaire, marquant la désertification définitive et l'adaptation des populations nomades touarègues.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO N° 179 • République Algérienne</span>
                    <span>Page 2 de 4</span>
                  </div>
                </div>
              )}

              {/* PAGE 3 */}
              {currentPage === 3 && (
                <div className="space-y-5 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2">
                    <p className="text-[10px] font-mono text-amber-800 font-bold uppercase">ÉVALUATION DES ATTRIBUTS DU BIEN</p>
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      INTÉGRITÉ ET AUTHENTICITÉ DU TASSILI N'AJJER
                    </h2>
                  </div>

                  <div className="space-y-3 font-sans text-xs text-gray-800">
                    <div className="p-3 bg-amber-50/70 border-l-4 border-amber-800 space-y-1.5">
                      <h3 className="font-bold text-amber-950 font-serif text-xs uppercase">
                        1. INTÉGRITÉ DU SITE (72 000 KM²)
                      </h3>
                      <p className="text-justify leading-relaxed">
                        Le bien contient l'ensemble des sites d'art rupestre et des paysages clés représentant sa beauté naturelle et tous les sites de la diversité biologique et écologique qui constituent les attributs de la valeur universelle exceptionnelle. Les limites et la taille (72 000 km²) du bien sont suffisantes pour maintenir le processus géologique et garantir l'intégrité de l'héritage culturel du site.
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 border-l-4 border-gray-800 space-y-1.5">
                      <h3 className="font-bold text-gray-900 font-serif text-xs uppercase">
                        2. AUTHENTICITÉ ET VULNÉRABILITÉ
                      </h3>
                      <p className="text-justify leading-relaxed">
                        La richesse du patrimoine culturel (art rupestre et vestiges archéologiques) et la diversité naturelle (écosystème, faune, flore et zones humides) reflètent pleinement la valeur universelle exceptionnelle. Ils sont vulnérables aux détériorations causées par les phénomènes climatiques et aux dommages occasionnés par les visiteurs.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50/50 border border-amber-300 rounded space-y-1">
                      <h3 className="font-bold text-amber-950 text-xs">
                        Écosystème & Flore Éndémique (Le Cyprès du Tassili / Tarout)
                      </h3>
                      <p className="text-justify text-[11px] text-gray-700">
                        Le plateau abrite le <strong>Tarout (Cupressus dupreziana)</strong>, cyprès du Tassili rarissime dont certains spécimens sont millénaires, ainsi que des populations de mouflons à manchettes et de gazelles de Dorcas.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO N° 179 • République Algérienne</span>
                    <span>Page 3 de 4</span>
                  </div>
                </div>
              )}

              {/* PAGE 4 */}
              {currentPage === 4 && (
                <div className="space-y-5 animate-fade-in text-xs sm:text-sm leading-relaxed">
                  
                  <div className="border-b-2 border-gray-900 pb-2 flex justify-between items-center">
                    <h2 className="font-bold font-serif text-base text-gray-900 uppercase">
                      PROTECTION ET GESTION (OPNT & LOI 98-04)
                    </h2>
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                      MINISTÈRE DE LA CULTURE
                    </span>
                  </div>

                  <div className="space-y-3 font-sans text-xs text-gray-800">
                    <div className="p-3.5 bg-amber-50 border-l-4 border-amber-800 space-y-1.5">
                      <h3 className="font-bold text-gray-900 font-serif text-xs uppercase">
                        CADRE JURIDIQUE : LOI 98-04 ET PARC CULTUREL
                      </h3>
                      <p className="text-justify leading-relaxed">
                        Le Ministère de la Culture a introduit, dans le cadre de la loi sur le patrimoine culturel (loi 98-04 relative à la protection du patrimoine culturel), la catégorie de protection des <strong>Parcs Culturels</strong>. Ce cadre régit la conservation des espaces géographiques où s'imbriquent les valeurs culturelles et naturelles, depuis les grottes préhistoriques jusqu'aux tissus urbains.
                      </p>
                    </div>

                    <div className="p-3.5 bg-gray-50 border border-gray-300 rounded space-y-1.5">
                      <h3 className="font-bold text-gray-900 font-serif text-xs uppercase">
                        OFFICE NATIONAL DU PARC DU TASSILI (OPNT)
                      </h3>
                      <p className="text-justify leading-relaxed text-[11.5px]">
                        La gestion durable est assurée par l'<strong>Office du Parc du Tassili (OPNT)</strong>, Établissement Public à caractère Administratif (EPA). Il est doté d'un budget annuel de fonctionnement et d'équipement pour la préservation, la recherche scientifique et la promotion de bonnes pratiques d'utilisation durable.
                      </p>
                      <p className="text-justify text-[11px] text-gray-700 italic border-t border-gray-200 pt-1.5">
                        L'activité touristique est strictly contrôlée : tous les groupes de visiteurs sont obligatoirement accompagnés par un guide officiel de l'OPNT pour garantir la protection de ce bien mondial d'exception.
                      </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <div className="border-2 border-amber-900 text-amber-950 p-2.5 font-mono text-[10px] text-center uppercase tracking-widest rounded bg-amber-50">
                        ✓ DOSSIER UNESCO CERTIFIÉ N° 179<br />
                        OPNT • DIRECTION DU PATRIMOINE CULTUREL — DJANET
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300 flex justify-between text-[10px] font-mono text-gray-500">
                    <span>UNESCO N° 179 • République Algérienne</span>
                    <span>Page 4 de 4</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: FICHE TECHNIQUE & RAPPORT PÉRIODIQUE */}
          {activeTab === 'technical' && (
            <div className="w-full max-w-4xl space-y-6 animate-fade-in text-xs sm:text-sm">
              <div className="bg-[#1e1e1e] p-5 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-serif font-bold text-base">
                  <ShieldCheck className="text-amber-400 shrink-0" size={20} />
                  <h3>Fiche Technique & Données du Rapport Périodique UNESCO</h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Extrait officiel des rapports de suivi de la Convention du Patrimoine Mondial relatif au bien N° 179 (République Algérienne).
                </p>
              </div>

              {/* Geographical Data Table */}
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-3">
                <h4 className="font-bold text-amber-300 text-xs uppercase font-mono tracking-wider">
                  1. Données Géographiques et Administratives (1.3)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] text-slate-200 border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-amber-400 border-b border-white/10">
                        <th className="p-2">Nom du Bien</th>
                        <th className="p-2">Coordonnées</th>
                        <th className="p-2">Bien (ha)</th>
                        <th className="p-2">Zone Tampon (ha)</th>
                        <th className="p-2">Total (ha)</th>
                        <th className="p-2">Année D'inscription</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-2 font-bold text-white">Tassili n'Ajjer</td>
                        <td className="p-2">25.5° N / 9.0° E</td>
                        <td className="p-2 text-amber-300">7 200 000 ha</td>
                        <td className="p-2 text-slate-400">0 ha (Inutile)</td>
                        <td className="p-2 text-amber-300 font-bold">7 200 000 ha</td>
                        <td className="p-2 text-amber-400 font-bold">1982</td>
                      </tr>
                      <tr className="bg-white/5 text-[10.5px]">
                        <td colSpan={6} className="p-2 italic text-slate-300">
                          * Note: Le statut de l'Office du Parc Culturel (OPNT) fixé par le Décret Exécutif N° 12-292 (21 juillet 2012) étend la superficie de protection globale à 138 000 km² (13 800 000 ha).
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legal Framework & Decrees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs uppercase font-mono">
                    Textes Législatifs Nationaux (5.2.2)
                  </h4>
                  <ul className="space-y-2 text-slate-300 text-[11.5px] list-disc list-inside">
                    <li>
                      <strong className="text-white">Décret du 27 juillet 1972 :</strong> Création du Parc National du Tassili n'Ajjer et instauration de l'Office de gestion.
                    </li>
                    <li>
                      <strong className="text-white">Arrêté du 30 septembre 1987 :</strong> Classement officiel du site parmi les monuments historiques nationaux.
                    </li>
                    <li>
                      <strong className="text-white">Loi N° 98-04 (15 juin 1998) :</strong> Loi relative à la protection du patrimoine culturel instaurant la catégorie des <em>Parcs Culturels</em>.
                    </li>
                    <li>
                      <strong className="text-white">Décret Exécutif N° 12-292 (21 juillet 2012) :</strong> Fixe le statut de l'OPNT (Établissement Public Administratif - EPA) et la superficie de 138 000 km².
                    </li>
                  </ul>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-2">
                  <h4 className="font-bold text-amber-300 text-xs uppercase font-mono">
                    Patrimoine Immatériel UNESCO Associé (2.10)
                  </h4>
                  <div className="space-y-2 text-slate-300 text-[11.5px]">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-400 font-bold block">🎻 L'Imzad (Inscrit en 2013) :</span>
                      Savoirs et pratiques liés à l'imzad des communautés touarègues d’Algérie, du Mali et du Niger.
                    </div>
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-400 font-bold block">⚔️ La Sebeïba (Inscrite en 2014) :</span>
                      Rituel et cérémonies de la Sebeïba célébrés chaque année par la communauté oasienne de Djanet.
                    </div>
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-400 font-bold block">🏰 Les 3 Ksour de Djanet (Classés 2018) :</span>
                      Avis favorable de classement pour les Ksour historiques d'El Mihan, Adjahil et Zellouaz.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ART RUPESTRE (4 PERIODES) */}
          {activeTab === 'rockart' && (
            <div className="w-full max-w-4xl space-y-6 animate-fade-in text-xs sm:text-sm">
              <div className="bg-[#1e1e1e] p-5 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse text-amber-400 font-serif font-bold text-base">
                  <Compass className="text-amber-400 shrink-0" size={20} />
                  <h3>Les 4 Grandes Périodes Chronologiques de l'Art Rupestre</h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Considéré par l'UNESCO comme l'un des plus importants ensembles d'art pariétal au monde (+15 000 peintures et gravures répertoriées).
                </p>
              </div>

              {/* Chronological Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
                    PÉRIODE 1 • 8 000 À 6 000 AV. J.-C.
                  </span>
                  <h4 className="text-white font-serif font-bold text-sm">Période des Têtes Rondes (Archaïque)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Figures humaines mystiques aux formes arrondies, êtres masqués de taille gigantesque ("Le Grand Dieu de Sefar"), rituels sacrés peints à l'ocre rouge et au kaolin blanc.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
                    PÉRIODE 2 • 6 000 À 1 500 AV. J.-C.
                  </span>
                  <h4 className="text-white font-serif font-bold text-sm">Période Bovidienne (Pastorale)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Scènes de la vie quotidienne pastorale, grands troupeaux de bovins aux cornes travaillées, femmes et enfants sous les tentes dans une savane verdoyante.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
                    PÉRIODE 3 • ~1 200 AV. J.-C.
                  </span>
                  <h4 className="text-white font-serif font-bold text-sm">Période Équidienne (Chevaline)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Apparition du cheval, des guerriers et des chars au "galop volant", témoignant des prémices de la désertification et des contacts méditerranéens.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded">
                    PÉRIODE 4 • À PARTIR DU IER SIÈCLE AV. J.-C.
                  </span>
                  <h4 className="text-white font-serif font-bold text-sm">Période Caméline (Chameaux & Tifinagh)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Représentations du dromadaire et inscriptions en caractères Tifinagh. Marque l'adaptation de la civilisation touarègue au climat hyperaride.
                  </p>
                </div>
              </div>

              {/* Masterpiece Showcase */}
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-3">
                <h4 className="font-bold text-amber-300 text-xs uppercase font-mono">
                  Chefs-d'œuvre & Clichés Authentiques d'Art Rupestre (Tassili)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                    <img 
                      src="/src/assets/images/tassili_art_dancers_1784674422643.jpg" 
                      alt="Cercle des danseurs" 
                      className="w-full h-32 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-90"
                      onClick={() => setActiveLightbox(tassiliGalleryPhotos[2])}
                    />
                    <p className="text-[11px] font-mono text-amber-300 font-bold">1. Cercle des Danseurs</p>
                    <p className="text-[10px] text-slate-400">Scène de rituel sacré de la Période Bovidienne peinte à l'ocre.</p>
                  </div>
                  <div className="space-y-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                    <img 
                      src="/src/assets/images/tassili_art_figures_1784674477805.jpg" 
                      alt="Figures rituelles Têtes Rondes" 
                      className="w-full h-32 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-90"
                      onClick={() => setActiveLightbox(tassiliGalleryPhotos[6])}
                    />
                    <p className="text-[11px] font-mono text-amber-300 font-bold">2. Coiffures Cérémoniales</p>
                    <p className="text-[10px] text-slate-400">Figures humaines peintes en blanc et ocre avec parures cérémoniales.</p>
                  </div>
                  <div className="space-y-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                    <img 
                      src="/src/assets/images/tassili_art_giraffe_1784674491289.jpg" 
                      alt="Girafe de l'ocre" 
                      className="w-full h-32 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-90"
                      onClick={() => setActiveLightbox(tassiliGalleryPhotos[7])}
                    />
                    <p className="text-[11px] font-mono text-amber-300 font-bold">3. Girafe de l'Ocre Rouge</p>
                    <p className="text-[10px] text-slate-400">Gravure et peinture de la faune sauvage du Sahara préhistorique.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ÉCOSYSTÈME & BIODIVERSITÉ */}
          {activeTab === 'biodiversity' && (
            <div className="w-full max-w-4xl space-y-6 animate-fade-in text-xs sm:text-sm">
              <div className="bg-[#1e1e1e] p-5 rounded-xl border border-emerald-500/30 space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-400 font-serif font-bold text-base">
                  <Trees className="text-emerald-400 shrink-0" size={20} />
                  <h3>Écosystème Saharien & Réserve de Biosphère (1986)</h3>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Le Tassili n'Ajjer est une ceinture écologique réunissant des espèces animales et végétales d'origine saharienne, tropicale et méditerranéenne.
                </p>
              </div>

              {/* Endemic Species Cards with Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-3">
                  <img 
                    src="/src/assets/images/tassili_tarout_tree_1784674506915.jpg" 
                    alt="Cyprès du Tassili / Tarout"
                    className="w-full h-36 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-90"
                    onClick={() => setActiveLightbox(tassiliGalleryPhotos[8])}
                  />
                  <div>
                    <h4 className="text-emerald-400 font-bold text-xs font-serif uppercase">
                      🌲 Le Cyprès du Tassili / Tarout (Cupressus dupreziana)
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed mt-1">
                      Espèce d'arbre extrêmement rare et relique de la période humide. Certains spécimens sont âgés de plus de 2 000 ans. Il ne subsiste environ que 230 arbres adultes à l'état sauvage sur le plateau.
                    </p>
                  </div>
                </div>

                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-3">
                  <img 
                    src="/src/assets/images/tassili_oasis_canyon_1784674520880.jpg" 
                    alt="Vallée de Canyon et Palmeraie"
                    className="w-full h-36 object-cover rounded-lg border border-white/10 cursor-pointer hover:opacity-90"
                    onClick={() => setActiveLightbox(tassiliGalleryPhotos[9])}
                  />
                  <div>
                    <h4 className="text-emerald-400 font-bold text-xs font-serif uppercase">
                      🌴 Oasis de Canyon & Habitats Nomades
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed mt-1">
                      Les gueltas et canyons conservent de la fraîcheur et une végétation ouasienne où se réfugient la faune saharienne (Mouflon à manchettes, Gazelle Dorcas) et les pasteurs touaregs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Climate Factors & Periodic Report Monitoring */}
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/10 space-y-3">
                <h4 className="font-bold text-amber-300 text-xs uppercase font-mono">
                  Suivi des Facteurs Climatiques & Risques (Rapport Périodique 4.7 / 4.10)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                  <div className="p-3 bg-black/40 rounded-lg border border-amber-500/20">
                    <span className="text-amber-400 font-bold block">💨 Vent & Tempêtes :</span>
                    Projets de création d'une plateforme et base de données de suivi (2020-2030) par l'OPNT et la Météorologie.
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-amber-500/20">
                    <span className="text-amber-400 font-bold block">🌡️ Chaleur Extrême :</span>
                    Évaluation régulière de l'impact des pics de température sur l'érosion des peintures rupestres.
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-amber-500/20">
                    <span className="text-amber-400 font-bold block">💧 Pluies Torrentielles :</span>
                    Protection des gueltas et bassins versants face aux inondations soudaines hors saison.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GALERIE PHOTOGRAPHIQUE OFFICIELLE (11 PHOTOS) */}
          {activeTab === 'photos' && (
            <div className="w-full max-w-5xl space-y-6 animate-fade-in">
              <div className="bg-[#1e1e1e] p-5 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-amber-400 font-bold font-serif text-base flex items-center space-x-2 space-x-reverse">
                    <Eye className="text-amber-400 shrink-0" size={18} />
                    <span>Galerie Documentaire Officielle du Tassili n'Ajjer (11 Clichés)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Collection photographique haute résolution : Art rupestre préhistorique, géologie du Paléozoïque, Forêt de Rochers de Sefar & biodiversité du Tarout.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                    11 Clichés Certifiés
                  </span>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['Tous', 'Art Rupestre', 'Géologie', 'Erg & Canyons', 'Biodiversité'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                        : 'bg-black/40 text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat} ({cat === 'Tous' ? tassiliGalleryPhotos.length : tassiliGalleryPhotos.filter(p => p.category === cat).length})
                  </button>
                ))}
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id}
                    onClick={() => setActiveLightbox(photo)}
                    className="group bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-amber-500/50 transition duration-200 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video overflow-hidden bg-black/60">
                      <img 
                        src={photo.src} 
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-black/80 text-amber-300 px-2 py-0.5 rounded border border-white/20">
                        {photo.category}
                      </span>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <ZoomIn className="text-amber-400" size={24} />
                      </div>
                    </div>
                    <div className="p-3 space-y-1 bg-[#181818] flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white text-xs font-bold font-serif group-hover:text-amber-300 transition line-clamp-1">
                          {photo.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                          {photo.desc}
                        </p>
                      </div>
                      <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-white/5">
                        <span>Photographie N° {photo.id}/11</span>
                        <span className="text-amber-400/80 font-bold group-hover:translate-x-1 transition">Agrandir →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lightbox Modal */}
              {activeLightbox && (
                <div 
                  className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                  onClick={() => setActiveLightbox(null)}
                >
                  <div 
                    className="bg-[#1a1a1a] border border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Lightbox Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/50">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
                          {activeLightbox.category} • Photo {activeLightbox.id} sur 11
                        </span>
                        <h3 className="text-white font-serif font-bold text-sm sm:text-base mt-1">
                          {activeLightbox.title}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setActiveLightbox(null)}
                        className="p-1.5 text-slate-400 hover:text-white bg-white/10 rounded-lg cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Lightbox Image */}
                    <div className="flex-1 bg-black overflow-hidden flex items-center justify-center p-2 sm:p-4">
                      <img 
                        src={activeLightbox.src} 
                        alt={activeLightbox.title}
                        referrerPolicy="no-referrer"
                        className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl"
                      />
                    </div>

                    {/* Lightbox Footer */}
                    <div className="p-4 border-t border-white/10 bg-[#141414] space-y-3">
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                        {activeLightbox.desc}
                      </p>
                      <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-1">
                        <span>Parc National du Tassili n'Ajjer — Wilaya de Djanet</span>
                        <a 
                          href={activeLightbox.src} 
                          download={`Tassili_Photo_${activeLightbox.id}.jpg`} 
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1.5 space-x-reverse bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/40 text-xs font-bold transition"
                        >
                          <Download size={14} />
                          <span>Télécharger l'image HQ</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

