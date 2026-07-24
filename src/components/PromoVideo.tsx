import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Upload, AlertCircle, FileVideo, Sparkles, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PromoVideo: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default list of fallback video URLs (standard, highly compatible open-source web streams)
  const fallbackUrls = [
    "/rahala_trailer.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  ];
  const defaultVideoUrl = "/rahala_trailer.mp4";

  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  useEffect(() => {
    // Attempt to load video from IndexedDB first for offline persistence
    try {
      const dbRequest = indexedDB.open("RahalaVideoDatabase", 1);
      dbRequest.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("media")) {
          db.createObjectStore("media");
        }
      };

      dbRequest.onsuccess = (e: any) => {
        const db = e.target.result;
        const transaction = db.transaction("media", "readonly");
        const store = transaction.objectStore("media");
        const getRequest = store.get("promo_video");

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            const blob = getRequest.result;
            const objUrl = URL.createObjectURL(blob);
            setVideoFile(blob as File);
            setVideoUrl(objUrl);
            setHasPlaybackError(false);
          } else {
            // Fallback to localStorage or default
            let savedUrl = localStorage.getItem('rahala_promo_video_url');
            if (savedUrl && savedUrl.startsWith('blob:')) {
              savedUrl = null;
              localStorage.removeItem('rahala_promo_video_url');
            }
            if (savedUrl) {
              setVideoUrl(savedUrl);
            } else {
              setVideoUrl(defaultVideoUrl);
            }
          }
        };

        getRequest.onerror = () => {
          let savedUrl = localStorage.getItem('rahala_promo_video_url');
          if (savedUrl && savedUrl.startsWith('blob:')) {
            savedUrl = null;
            localStorage.removeItem('rahala_promo_video_url');
          }
          setVideoUrl(savedUrl || defaultVideoUrl);
        };
      };

      dbRequest.onerror = () => {
        let savedUrl = localStorage.getItem('rahala_promo_video_url');
        if (savedUrl && savedUrl.startsWith('blob:')) {
          savedUrl = null;
          localStorage.removeItem('rahala_promo_video_url');
        }
        setVideoUrl(savedUrl || defaultVideoUrl);
      };
    } catch (err) {
      let savedUrl = localStorage.getItem('rahala_promo_video_url');
      if (savedUrl && savedUrl.startsWith('blob:')) {
        savedUrl = null;
        localStorage.removeItem('rahala_promo_video_url');
      }
      setVideoUrl(savedUrl || defaultVideoUrl);
    }
  }, []);

  const handleVideoError = () => {
    console.warn("Video playback error detected on current URL:", videoUrl);
    if (!videoFile && fallbackIndex < fallbackUrls.length - 1) {
      const nextIndex = fallbackIndex + 1;
      setFallbackIndex(nextIndex);
      setVideoUrl(fallbackUrls[nextIndex]);
    } else {
      setHasPlaybackError(true);
    }
  };

  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      const errMsg = isRtl 
        ? "يرجى تحديد تنسيق ملف فيديو صالح (.mp4، .mov، .webm) ⚠️"
        : "Please select a valid video file format (.mp4, .mov, .webm) ⚠️";
      alert(errMsg);
      return;
    }

    setVideoFile(file);
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setIsPlaying(false);
    setHasPlaybackError(false);
    localStorage.setItem('rahala_promo_video_url', localUrl);

    // Save to IndexedDB for robust persistent offline storage
    try {
      const dbRequest = indexedDB.open("RahalaVideoDatabase", 1);
      dbRequest.onsuccess = (e: any) => {
        const db = e.target.result;
        const transaction = db.transaction("media", "readwrite");
        const store = transaction.objectStore("media");
        store.put(file, "promo_video");
      };
    } catch (err) {
      console.warn("Could not save video to IndexedDB:", err);
    }

    // Upload to our fullstack Express server in background so it serves permanently from same-origin
    fetch('/api/upload-video', {
      method: 'POST',
      headers: {
        'Content-Type': file.type
      },
      body: file
    })
    .then(async (res) => {
      if (res.ok) {
        console.log("Successfully uploaded video to same-origin server!");
        const data = await res.json();
        if (data.url) {
          localStorage.setItem('rahala_promo_video_url', data.url);
        }
      } else {
        console.warn("Same-origin upload returned non-200 status:", res.status);
      }
    })
    .catch((err) => {
      console.warn("Could not upload to server host (using local cache):", err);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoFile(e.target.files[0]);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Playback failed: ", err);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setVideoUrl(inputUrl);
      setIsPlaying(false);
      setHasPlaybackError(false);
      setFallbackIndex(0);
      localStorage.setItem('rahala_promo_video_url', inputUrl);
      setShowUrlInput(false);
    }
  };

  const handleResetDefault = () => {
    setVideoFile(null);
    setFallbackIndex(0);
    setVideoUrl(defaultVideoUrl);
    setIsPlaying(false);
    setHasPlaybackError(false);
    localStorage.setItem('rahala_promo_video_url', defaultVideoUrl);

    // Delete custom video from IndexedDB
    try {
      const dbRequest = indexedDB.open("RahalaVideoDatabase", 1);
      dbRequest.onsuccess = (e: any) => {
        const db = e.target.result;
        const transaction = db.transaction("media", "readwrite");
        const store = transaction.objectStore("media");
        store.delete("promo_video");
      };
    } catch (err) {
      console.warn("Could not delete video from IndexedDB:", err);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-900/60 dark:bg-[#111111]/80 border border-[#d4af37]/35 dark:border-white/10 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl backdrop-blur-md relative overflow-hidden" id="rahala-cinema-promo-deck">
      
      {/* Absolute Algerian gradient glow in corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left column: Video Description, Callout, Upload controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/15 rounded-full border border-[#d4af37]/40">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span className="text-[10px] uppercase font-mono font-black text-[#d4af37] tracking-widest flex items-center gap-1">
              <Film size={11} /> {t('promoTvLabel')}
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-serif font-black tracking-tight text-white leading-tight">
              {t('promoTitle')}
            </h1>
            <p className="text-xs text-slate-300 font-serif leading-relaxed">
              {t('promoSubtitle')}
            </p>
          </div>

          {/* Interactive features summary */}
          <div className="bg-blue-950/20 border border-blue-500/15 rounded-2xl p-4 space-y-3 text-xs leading-relaxed text-slate-200">
            <div className="flex items-start gap-2.5">
              <Sparkles size={16} className="text-[#d4af37] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-[#f5f2ed] mb-0.5">{t('didYouKnow')}</p>
                <p className="text-gray-400 text-[11px]">{t('didYouKnowText')}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Video Selector Panel (Drag and Drop / Upload) */}
          <div className="space-y-4">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 group ${
                dragActive 
                  ? "border-blue-500 bg-blue-500/10" 
                  : "border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 hover:bg-slate-950/60"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="video/*" 
                onChange={handleFileInput} 
                className="hidden" 
              />
              
              <div className="w-10 h-10 bg-slate-900 border border-slate-700 text-[#d4af37] group-hover:text-emerald-400 rounded-full flex items-center justify-center transition-all">
                {videoFile ? <FileVideo size={18} className="animate-pulse" /> : <Upload size={18} />}
              </div>

              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {videoFile ? `${t('videoActiveLabel')}${videoFile.name}` : t('dragVideoPlaceholder')}
                </p>
                <p className="text-[10.5px] text-[#d4af37] font-bold mt-1">
                  {videoFile ? t('clickToChangeVideo') : t('dragVideoSub')}
                </p>
                <p className="text-[9px] text-slate-400 mt-1">
                  {t('indexedDbWarning')}
                </p>
              </div>
            </div>

            {/* Actions for custom links or resetting */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-mono rounded-xl transition cursor-pointer"
                id="url-config-trigger"
              >
                {showUrlInput ? t('hideUrlFormBtn') : t('enterVideoUrlBtn')}
              </button>

              {videoUrl !== defaultVideoUrl && (
                <button
                  onClick={handleResetDefault}
                  className="px-4 py-2 bg-red-650/20 hover:bg-red-650/30 text-rose-350 hover:text-rose-200 text-[11px] font-mono border border-red-900/30 rounded-xl transition cursor-pointer"
                  id="reset-video-btn"
                >
                  {t('resetVideoDefaultBtn')}
                </button>
              )}
            </div>

            {/* URL input field */}
            {showUrlInput && (
              <form onSubmit={handleUrlSubmit} className="space-y-2.5 animate-fade-in bg-slate-950/60 p-4 border border-slate-800 rounded-2xl">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">{t('streamingUrlLabel')}</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://mon-serveur.ch/media/rahala.mp4"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-xl whitespace-nowrap transition cursor-pointer"
                  >
                    {t('activateBtn')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Immersive Cinematic Player Container */}
        <div className="lg:col-span-7">
          <div 
            className="relative rounded-3xl overflow-hidden border border-slate-750 bg-black aspect-video group shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {videoUrl && !hasPlaybackError ? (
              <video
                ref={videoRef}
                src={videoUrl}
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                onError={handleVideoError}
                className="w-full h-full object-cover transition duration-500 cursor-pointer"
                playsInline
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-center p-6" id="video-fallback-screen">
                <AlertCircle size={36} className="text-[#d4af37] mb-3 animate-pulse" />
                <p className="text-xs font-extrabold text-white uppercase tracking-wider">{t('playbackGuideTitle')}</p>
                <div className="max-w-sm mt-2 text-[10.5px] text-zinc-300 space-y-2 leading-relaxed">
                  <p>
                    {t('browserRestrictionsText')}
                  </p>
                  <p className="text-emerald-400 font-bold">
                    {t('localLoadSuggestion')}
                  </p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9.5px] uppercase rounded-xl tracking-wider font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-emerald-950/50 cursor-pointer"
                >
                  {t('selectVideoFileBtn')}
                </button>
              </div>
            )}

            {/* Glowing flag ribbons inside video header bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
              <div className="bg-emerald-600 flex-1"></div>
              <div className="bg-white max-w-[4px] w-full"></div>
              <div className="bg-red-600 flex-1"></div>
            </div>

            {/* Dark overlay when paused */}
            {!isPlaying && videoUrl && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/45 flex items-center justify-center cursor-pointer transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-[#d4af37] text-slate-950 rounded-full flex items-center justify-center shadow-lg transform scale-100 hover:scale-110 active:scale-95 transition duration-300 flex-shrink-0 animate-pulse">
                  <Play size={26} className="fill-slate-950 ml-1" />
                </div>
              </div>
            )}

            {/* Live custom control overlay (visible when hovered or paused) */}
            {videoUrl && (isHovered || !isPlaying) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-3 transition-opacity duration-300">
                
                {/* Seekbar scrub slider */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#f5f2ed]/80">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
                  />
                  <span className="text-[10px] font-mono text-[#f5f2ed]/80">{formatTime(duration)}</span>
                </div>

                {/* Lower control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#d4af37] transition cursor-pointer"
                      title={isPlaying ? t('pauseBtnTitle') : t('playBtnTitle')}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    {/* Mute/Unmute */}
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-emerald-400 transition cursor-pointer"
                      title={isMuted ? t('unmuteBtnTitle') : t('muteBtnTitle')}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    
                    {isMuted && (
                      <span className="text-[9px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 animate-pulse">
                        {t('muteActiveLabel')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Full screen */}
                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:text-[#d4af37] transition cursor-pointer"
                      title={t('theaterFullscreenTitle')}
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative prompt reference badge */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
        <p className="flex items-center gap-1.5 font-bold">
          <Sparkles size={11} className="text-[#d4af37]" /> {t('optimizedExperienceLabel')}
        </p>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-emerald-950/20 border border-emerald-500/35 rounded text-emerald-400">Cinematic 4K</span>
          <span className="px-2 py-0.5 bg-red-950/20 border border-red-500/35 rounded text-red-400">RAHALA AI</span>
        </div>
      </div>

    </div>
  );
};
