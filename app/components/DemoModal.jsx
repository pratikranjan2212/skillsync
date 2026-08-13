import React from 'react';
import { X, Play } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 rounded-4xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl relative border border-white/10 text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
              ▶
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">SkillSync Interactive App Tour</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          <video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-xs text-neutral-400 font-medium text-center mt-4">
          Discover how SkillSync helps you build steady daily habits without feeling overwhelmed.
        </p>

      </div>
    </div>
  );
}


