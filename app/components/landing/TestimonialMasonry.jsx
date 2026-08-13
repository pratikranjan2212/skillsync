import React, { useState } from 'react';
import { MASONRY_REVIEWS } from '@/app/data/skillsyncData.js';
import { X } from 'lucide-react';
import RollingText from "@/app/components/ui/RollingText";

export default function TestimonialMasonry() {
  const [reviews, setReviews] = useState(MASONRY_REVIEWS);
  const [showAll, setShowAll] = useState(false);
  const [hovered, setHovered] = useState(false);


  const dismissReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto relative">
      
      {/* Masonry Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start ${!showAll ? 'max-h-150 overflow-hidden' : ''}`}>
        {displayedReviews.map((item) => (
          <div
            key={item.id}
            className="bg-[#E6E6E6] rounded-3xl p-7 shadow-sm transition-all flex flex-col justify-between"
          >
            {/* Quote Text */}
            <p className="text-base font-medium text-[#494D4D] leading-snug mb-8">
              {item.quote}
            </p>

            {/* Bottom Row: Author + Dismiss Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className="text-[15px] font-bold text-[#131515]">{item.name}</h5>
                  <p className="text-[13px] text-[#494D4D]">{item.role}</p>
                </div>
              </div>
              
              <button
                onClick={() => dismissReview(item.id)}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-95 active:scale-90 transition-transform shadow-sm"
                title="Dismiss review"
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fade Out & View All Button */}
      {!showAll && (
        <div className="absolute bottom-0 left-0 w-full h-75 bg-linear-to-t from-[#F5F5F3] via-[#F5F5F3]/80 to-transparent flex items-end justify-center pb-12 z-10 pointer-events-none">
          <button
            onClick={() => setShowAll(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="px-8 py-4 rounded-full bg-[#131515] hover:bg-black text-white font-bold text-sm shadow-xl transition-all hover:-translate-y-1 active:scale-95 pointer-events-auto"
          >
            <RollingText
              text="View all Reviews"
              autoPlay={hovered}
              animationTrigger="onAppear"
              rollDuration={0.4}
              staggerDelay={0.015}
              textColor="#FFFFFF"
              font={{ fontSize: '14px', fontWeight: '700', lineHeight: '1.2em' }}
            />
          </button>
        </div>
      )}


    </section>
  );
}
