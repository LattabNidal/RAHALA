import React, { useState } from 'react';
import { 
  Share2, QrCode, Download, Copy, CheckCircle2, 
  Facebook, Twitter, ShieldCheck, Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface SocialShareProps {
  title: string;
  text: string;
  url: string;
  language: string;
  handleDownloadPDF: () => void;
  addNotification: (msg: string) => void;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  text,
  url,
  handleDownloadPDF,
  addNotification
}) => {
  const { currentUser } = useApp();
  const { t, isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);
  const fullTextAndUrl = `${text}\n${url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    addNotification(t('itineraryLinkCopied'));
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full mt-8 p-6 md:p-8 rounded-3xl bg-amber-500/[0.01] dark:bg-zinc-950/25 border border-[#d4af37]/25 dark:border-[#d4af37]/15 shadow-sm text-left relative overflow-hidden">
      {/* Decorative subtle gold glow accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Non-redundant unified Header + Traveler Session Verified Row */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-200/55 dark:border-zinc-800/55 mb-6 ${isRtl ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
        <div>
          <div className={`flex items-center gap-2 mb-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Share2 size={16} className="text-[#d4af37]" />
            <h4 className="text-sm font-mono font-black uppercase tracking-wider text-gray-800 dark:text-gray-100">
              {t('authSharePortal')}
            </h4>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('sharePortalSubtitle')}{title}
          </p>
        </div>
 
        {/* Dynamic Traveler Session Badge */}
        <div className={`flex items-center gap-2.5 p-2 px-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <ShieldCheck className="text-emerald-500 shrink-0 animate-pulse" size={15} />
          <div className={`text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold block">
              {t('certifiedSession')}
            </span>
            <span className="text-[11px] text-gray-700 dark:text-gray-300 font-semibold font-mono">
              {currentUser?.name || 'Nidal Lattab'} ({t('activeLabel')})
            </span>
          </div>
        </div>
      </div>
 
      {/* Modern 3-Column Horizontal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Direct Link & Social Quick Share */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40">
          <div>
            <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Copy size={15} className="text-[#d4af37]" />
              <h5 className="text-xs font-mono font-black uppercase tracking-wider text-gray-700 dark:text-gray-200">
                {t('shareLinkLabel')}
              </h5>
            </div>
            <p className={`text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('shareLinkDescription')}
            </p>
          </div>
 
          <div className="space-y-3">
            <div className={`flex gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <input
                type="text"
                readOnly
                value={url}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-gray-600 dark:text-gray-300 font-mono focus:outline-none select-all text-ellipsis overflow-hidden whitespace-nowrap"
              />
              <button
                onClick={handleCopy}
                className="flex items-center justify-center p-2 rounded-xl bg-[#1a1a1a] dark:bg-[#f5f2ed] text-white dark:text-[#1a1a1a] hover:bg-[#d4af37] dark:hover:bg-[#d4af37] hover:text-black dark:hover:text-black transition cursor-pointer shrink-0"
                title={t('shareLinkLabel')}
              >
                {copied ? <CheckCircle2 size={14} className="text-blue-500" /> : <Copy size={14} />}
              </button>
            </div>
 
            {/* Micro Social Share Shortcuts */}
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-[9px] font-mono uppercase text-gray-400">{t('shareLabel')}</span>
              <div className="flex gap-1.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(fullTextAndUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition"
                  title="WhatsApp"
                >
                  <Send size={12} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-800 dark:text-zinc-200 transition"
                  title="Twitter / X"
                >
                  <Twitter size={12} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition"
                  title="Facebook"
                >
                  <Facebook size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
 
        {/* Column 2: Elegant Frameable QR Code */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40">
          <div>
            <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <QrCode size={15} className="text-[#d4af37]" />
              <h5 className="text-xs font-mono font-black uppercase tracking-wider text-gray-700 dark:text-gray-200">
                {t('syncQrCode')}
              </h5>
            </div>
            <p className={`text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('syncQrDescription')}
            </p>
          </div>
 
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
            <div className="p-1.5 bg-white rounded-lg border border-[#d4af37]/30 shrink-0">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}`}
                alt="Itinerary QR"
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={`text-left ${isRtl ? 'text-right' : ''}`}>
              <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400 block uppercase">
                {t('scanSmartphone')}
              </span>
              <p className="text-[10px] text-gray-500 leading-snug mt-0.5">
                {t('mobileAccessOptimized')}
              </p>
            </div>
          </div>
        </div>
 
        {/* Column 3: Printable Offline PDF Guide */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40">
          <div>
            <div className={`flex items-center gap-2 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Download size={15} className="text-[#d4af37]" />
              <h5 className="text-xs font-mono font-black uppercase tracking-wider text-gray-700 dark:text-gray-200">
                {t('pdfTravelGuide')}
              </h5>
            </div>
            <p className={`text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('pdfTravelDescription')}
            </p>
          </div>
 
          <div>
            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 hover:border-[#d4af37]/50 text-[#d4af37] font-mono text-xs font-black uppercase tracking-wider transition cursor-pointer"
            >
              <Download size={13} className="shrink-0" />
              <span>{t('downloadPdfBtn')}</span>
            </button>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-[9px] font-mono text-blue-500 font-extrabold uppercase animate-pulse">●</span>
              <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 uppercase">
                {t('withIntegratedToken')}
              </span>
            </div>
          </div>
        </div>
 
      </div>
 
      {/* Security Disclaimer / Authentic Token Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
          {t('uniqueCertificationRef')}RIHLA-TOKEN-{(currentUser?.id || 'usr-928').toUpperCase()}
        </span>
        <div className={`flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <ShieldCheck size={12} className="shrink-0 text-amber-500" />
          <span>{t('unifiedAuthenticationSystem')}</span>
        </div>
      </div>
 
    </div>
  );
};
