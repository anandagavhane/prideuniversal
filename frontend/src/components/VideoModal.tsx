import React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink } from 'lucide-react';
import { YOUTUBE_EMBED_URL, YOUTUBE_DANCE_VIDEO_URL } from '../services/googleSheetsService';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#1E293B] rounded-2xl max-w-4xl w-full max-h-[86vh] flex flex-col overflow-hidden shadow-2xl border-2 border-amber-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-slate-700 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">💃</span>
            <h3 className="font-bold text-sm sm:text-base text-amber-300">
              Ganesh Festival Dance Showcase
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={YOUTUBE_DANCE_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-200 hover:text-white flex items-center gap-1"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Responsive Video Container */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={YOUTUBE_EMBED_URL}
            title="Ganesh Festival Video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>,
    document.body
  );
};

