import React, { useState } from 'react';
import { AUDIENCE_TAGS } from '@/app/data/skillsyncData.js';

export default function SocialProof() {
  const [activeTag, setActiveTag] = useState('#Founders');

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center bg-[#fefefe]">
      {/* Mixed Typography Headline with Inline Photos & Emoji */}
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-black leading-tight tracking-tight mb-10 max-w-4xl mx-auto">
        Build steady daily{' '}
        <span className="inline-block align-middle mx-1 w-20 h-10 sm:w-24 sm:h-12 rounded-full overflow-hidden shadow-sm ring-2 ring-emerald-400/30 bg-emerald-500/10">
          <img
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=200&auto=format&fit=crop"
            alt="Cyclist"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </span>{' '}
        habits with a layout that keeps your mornings, evenings,{' '}
        <span className="inline-block mx-1 transform hover:scale-110 transition-transform cursor-pointer">
          ⛅
        </span>{' '}
        and focus simple to follow.
      </h2>

      {/* Sub-label */}
      <p className="text-xs sm:text-sm font-semibold text-black uppercase tracking-wider mb-5">
        Used by people to improve routines.
      </p>

      {/* Interactive Tag Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
        {['#Founders', '#Students', '#Busy parents', '#Remote teams'].map((tag) => (
          <span
            key={tag}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#10271f] text-emerald-50 border border-emerald-400/20 transition-colors cursor-pointer hover:bg-[#173128]"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
