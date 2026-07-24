import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Maximize, 
  Minimize, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Info, 
  RefreshCw,
  Eye,
  Camera,
  X
} from 'lucide-react';

interface PanoramaViewerProps {
  /** Path to 360° equirectangular image */
  imagePath?: string;
  /** Title overlay */
  title?: string;
  /** Subtitle / location description */
  subtitle?: string;
  /** Initial camera Field of View in degrees */
  initialFov?: number;
  /** Enable auto-rotation by default */
  autoRotateDefault?: boolean;
  /** Custom container class */
  className?: string;
  /** Close callback if rendered inside a modal */
  onClose?: () => void;
  /** Fullscreen mode by default */
  fullscreenByDefault?: boolean;
}

// Equirectangular 360° Sphere Mesh
function PanoramaSphere({ url }: { url: string }) {
  // Use encoded URL to safely handle spaces in file paths like "Street View 360.jpg"
  const encodedUrl = encodeURI(url);
  const texture = useTexture(encodedUrl);

  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Loading overlay inside Canvas during texture download
function PanoramaLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/85 backdrop-blur-md border border-[#D4AF37]/30 text-white min-w-[220px] shadow-2xl select-none">
        <div className="relative flex items-center justify-center mb-3">
          <RefreshCw size={32} className="animate-spin text-[#D4AF37]" />
          <Compass size={14} className="absolute text-white/80" />
        </div>
        <div className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase mb-1.5">
          {Math.round(progress)}%
        </div>
        <div className="w-36 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-[#D4AF37] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-[11px] text-white/70 font-sans tracking-wide">
          Chargement du panorama 360°...
        </span>
      </div>
    </Html>
  );
}

// Controller component to update camera FOV on zoom
function CameraFovController({ fov }: { fov: number }) {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);

  return null;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  imagePath = '/panorama/Street View 360.jpg',
  title = 'Ancient Theater - Street View 360',
  subtitle = 'Patrimoine Romain d\'Algérie • Visite Virtuelle Immersive',
  initialFov = 75,
  autoRotateDefault = true,
  className = '',
  onClose,
  fullscreenByDefault = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const [fov, setFov] = useState<number>(initialFov);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(autoRotateDefault);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(fullscreenByDefault);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Fullscreen toggle logic
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Sync state with fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    setFov((prev) => Math.max(30, prev - 10));
  };

  const handleZoomOut = () => {
    setFov((prev) => Math.min(100, prev + 10));
  };

  // Reset orientation
  const handleReset = () => {
    setFov(initialFov);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden select-none font-sans ${
        isFullscreen ? 'fixed inset-0 z-[99999] h-screen w-screen' : ''
      } ${className}`}
    >
      {/* 360 WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: fov }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <CameraFovController fov={fov} />
        <Suspense fallback={<PanoramaLoader />}>
          <PanoramaSphere url={imagePath} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={-0.45}
          minDistance={0.1}
          maxDistance={100}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.6}
        />
      </Canvas>

      {/* Top Header Overlay */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none flex items-start justify-between z-20">
        {/* Title & Badge */}
        <div className="flex flex-col space-y-1 max-w-lg pointer-events-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-[#D4AF37]/15 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-widest w-fit">
            <Compass size={12} className="animate-spin-slow" />
            <span>Vue Panoramique 360° HD</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-md">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-sans tracking-wide">
            {subtitle}
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center space-x-2 space-x-reverse pointer-events-auto">
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg"
            title="Informations"
          >
            <Info size={18} />
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg"
              title="Fermer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        
        {/* Help tooltip */}
        <div className="hidden sm:flex items-center space-x-2 space-x-reverse px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/70 text-[11px] font-mono pointer-events-auto">
          <Eye size={13} className="text-[#D4AF37]" />
          <span>Glissez pour pivoter à 360° • Molette pour zoomer</span>
        </div>

        {/* Action Bar */}
        <div className="flex items-center space-x-2 space-x-reverse bg-black/75 backdrop-blur-xl border border-white/15 p-1.5 rounded-2xl shadow-2xl pointer-events-auto">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 space-x-reverse ${
              isAutoRotating 
                ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            title={isAutoRotating ? 'Désactiver la rotation' : 'Activer la rotation automatique'}
          >
            <RotateCw size={16} className={isAutoRotating ? 'animate-spin' : ''} />
            <span className="hidden md:inline text-xs font-mono font-bold uppercase tracking-wider">
              {isAutoRotating ? 'Auto' : 'Fixe'}
            </span>
          </button>

          <div className="h-5 w-px bg-white/20 my-auto" />

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={fov <= 30}
            className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Zoom Avant"
          >
            <ZoomIn size={18} />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={fov >= 100}
            className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Zoom Arrière"
          >
            <ZoomOut size={18} />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Réinitialiser la vue"
          >
            <Compass size={18} />
          </button>

          <div className="h-5 w-px bg-white/20 my-auto" />

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            title={isFullscreen ? 'Quitter le mode plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-[#D4AF37]/30 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="flex items-center space-x-3 space-x-reverse mb-4">
              <div className="p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">{title}</h3>
                <p className="text-xs text-[#D4AF37] font-mono uppercase tracking-wider">{subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Explorez ce monument historique à 360 degrés grâce à la technologie de rendu équirectangulaire haute définition WebGL. Vous pouvez pivoter la caméra en glissant avec la souris ou votre doigt.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF37]/90 transition-all cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;
