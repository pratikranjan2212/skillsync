import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialPhotoCarousel() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden bg-[#F5F5F3]">
      
      {/* Header Block with Rating Cluster */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <h2 className="text-4xl sm:text-[3.5rem] font-extrabold text-[#131515] tracking-tight font-heading leading-tight max-w-125">
            What users are achieving with SkillSync
          </h2>
        </div>

        {/* Right Stacked Avatars Cluster */}
        <div className="flex flex-col items-start md:items-end shrink-0 self-start md:self-auto gap-2">
          <div className="flex -space-x-3 overflow-hidden">
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" />
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="User" />
            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop" alt="User" />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#131515] text-[11px] font-bold text-white ring-2 ring-white shadow-sm">
              +51
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex text-[#FFB020] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm font-semibold text-[#494D4D]">Trusted worldwide</p>
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Maya */}
        <div className="rounded-4xl overflow-hidden relative h-112.5 shadow-lg group">
          <img
            src="https://images.unsplash.com/photo-1621317586241-118e7c1c1f01?q=80&w=800&auto=format&fit=crop"
            alt="Maya"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#2A050A]/90 via-[#2A050A]/20 to-[#2A050A]/10 p-8 flex flex-col justify-between text-white">
            <div>
              <span className="text-white font-extrabold text-base">Maya <span className="font-medium text-white/70 text-sm ml-1">- Student</span></span>
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-white max-w-50">
                Completed 21-day streak using SkillSync
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Daniel gray */}
        <div className="rounded-4xl overflow-hidden relative h-112.5 shadow-lg group">
          <img
            src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop"
            alt="Daniel gray"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/10 p-8 flex flex-col justify-between text-white">
            <div>
              <span className="text-white font-extrabold text-base">Daniel gray <span className="font-medium text-white/70 text-sm ml-1">- Founder</span></span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-white block mb-1 font-heading tracking-tight">87%</span>
              <p className="text-lg font-bold leading-tight text-white max-w-50">
                Improved weekly consistency
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Aaron Lee */}
        <div className="rounded-4xl overflow-hidden relative h-112.5 shadow-lg group">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
            alt="Aaron Lee"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#021424]/90 via-[#021424]/20 to-[#021424]/10 p-8 flex flex-col justify-between text-white">
            <div>
              <span className="text-white font-extrabold text-base">Aaron Lee <span className="font-medium text-white/70 text-sm ml-1">- Remote Engineer</span></span>
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-white max-w-60">
                Stopped breaking habits on weekends after switching to SkillSync
              </p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
