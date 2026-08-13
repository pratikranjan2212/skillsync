import React, { useState, useRef } from 'react';
import { VIDEO_TESTIMONIALS } from '../data/skillsyncData.js';
import { Play, VolumeX, ChevronLeft, ChevronRight, Star, Maximize, MoreVertical } from 'lucide-react';

export default function VideoTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [playingId, setPlayingId] = useState(null);
  const videoRefs = useRef({});

  const togglePlay = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        Object.keys(videoRefs.current).forEach((k) => {
          if (k !== id && videoRefs.current[k]) {
            videoRefs.current[k].pause();
          }
        });
        video.play();
        setPlayingId(id);
      } else {
        video.pause();
        setPlayingId(null);
      }
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? VIDEO_TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === VIDEO_TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto text-center overflow-hidden">
      
      {/* Header Block */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-black/10 bg-white mb-6">
          <span className="text-xs font-semibold text-[#131515]">A closer look</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#131515] tracking-tight mb-4">
          How people use <br className="hidden sm:inline" /> SkillSync every day
        </h2>

        {/* Rating Sub-Bar */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[#131515] font-bold text-sm">
          <span>4.5/5</span>
          <div className="flex text-[#FFB020]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="font-medium text-[#494D4D]">(Trusted by 1582+ users)</span>
        </div>
      </div>

      {/* Video Player Carousel */}
      <div className="relative max-w-250 mx-auto">
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
          {VIDEO_TESTIMONIALS.map((item, index) => {
            const isCenter = index === currentIndex;

            return (
              <div
                key={item.id}
                className={`shrink-0 rounded-4xl overflow-hidden relative transition-all duration-500 shadow-xl bg-black ${
                  isCenter
                    ? 'w-[320px] sm:w-95 h-145 sm:h-170 scale-100 z-20 border border-[#7B5EE4]'
                    : 'w-70 sm:w-[320px] h-125 sm:h-150 opacity-40 scale-95 z-10 hidden sm:block'
                }`}
              >
                {/* Fade Overlay for Side Videos */}
                {!isCenter && (
                  <div className="absolute inset-0 bg-linear-to-r from-[#F5F5F3]/30 to-[#F5F5F3]/80 z-30 pointer-events-none" />
                )}

                {/* HTML5 Video Element */}
                <video
                  ref={(el) => (videoRefs.current[item.id] = el)}
                  src={item.videoUrl}
                  poster={item.poster}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video Overlays (Only for Center Video) */}
                {isCenter && (
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-5">
                    
                    {/* Top Name Overlay */}
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="text-left text-white drop-shadow-md">
                        <div className="text-sm font-bold">{item.name}</div>
                        <div className="text-xs font-medium text-white/80">{item.role}</div>
                      </div>
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="flex items-center gap-3 text-white/90 pointer-events-auto mt-auto pb-2">
                      <button onClick={() => togglePlay(item.id)} className="hover:text-white">
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <span className="text-[11px] font-medium">0:00</span>
                      
                      {/* Progress Line */}
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="w-0 h-full bg-white rounded-full"></div>
                      </div>
                      
                      <button className="hover:text-white">
                        <VolumeX className="w-4 h-4" />
                      </button>
                      <button className="hover:text-white">
                        <Maximize className="w-4 h-4" />
                      </button>
                      <button className="hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel Control Arrows */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-[#E6E6E6] hover:bg-[#D9D9D9] text-[#131515] flex items-center justify-center transition-colors"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-[#E6E6E6] hover:bg-[#D9D9D9] text-[#131515] flex items-center justify-center transition-colors"
            aria-label="Next video"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </section>
  );
}
