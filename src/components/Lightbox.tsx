import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './rahala/LazyImage';

interface LightboxProps {
  isOpen: boolean;
  images: { url: string; label?: string; attribution?: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  // Keyboard listeners for navigation and closing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Disable body scrolling when open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, images]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrev = () => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6"
        id="lightbox-container"
      >
        {/* Header toolbar */}
        <div className="flex justify-between items-center z-10 w-full select-none">
          <div className="text-white text-xs font-mono font-medium tracking-wider bg-black/45 backdrop-blur-sm px-3 py-1.5 border border-white/10 rounded-full">
            {currentIndex + 1} / {images.length} {currentImage.label && `— ${currentImage.label}`}
          </div>
          
          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 hover:scale-105 cursor-pointer flex items-center justify-center shadow-lg"
            title="Close Lightbox (Esc)"
            id="lightbox-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Center Stage Panel */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          {/* Navigation left arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              title="Previous Image (Left Arrow)"
              id="lightbox-prev-btn"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Main expanded image with animations */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="max-w-full max-h-[80vh] flex items-center justify-center"
          >
            <LazyImage
              src={currentImage.url}
              alt={currentImage.label || `Lightbox Image ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl select-none"
            />
          </motion.div>

          {/* Navigation right arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              title="Next Image (Right Arrow)"
              id="lightbox-next-btn"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Footer info bar */}
        <div className="w-full text-center p-3 select-none">
          {currentImage.attribution && (
            <div 
              className="text-[10px] font-mono text-gray-400 max-w-2xl mx-auto truncate"
              dangerouslySetInnerHTML={{ __html: currentImage.attribution }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
