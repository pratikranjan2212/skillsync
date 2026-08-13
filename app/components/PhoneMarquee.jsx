"use client";

import React, { useState } from "react";
import { MARQUEE_ITEMS_TOP, MARQUEE_ITEMS_BOTTOM } from '../data/skillsyncData.js';
import { Star, Apple, Play, TrendingUp, Sparkles, Zap, Moon, CheckCircle2, Droplets } from 'lucide-react';
import RollingText from "./RollingText";

export default function PhoneMarquee({ onOpenAppModal }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative border-y border-black/5">
      
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-12 hidden md:block">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#131515] tracking-tight">
          Track weekly momentum seamlessly
        </h2>
      </div>

      {/* Phone + Flanking Marquee Layout */}
      <div className="relative max-w-7xl mx-auto flex items-center justify-center">
        
        {/* Left & Right Infinite Marquees Container (Absolute Background / Overflow) */}
        <div className="absolute inset-0 flex flex-col justify-center gap-6 pointer-events-auto opacity-80 sm:opacity-100">
          
          {/* Top Marquee Row (Moving Left) */}
          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="animate-marquee-left flex gap-6">
              {[...MARQUEE_ITEMS_TOP, ...MARQUEE_ITEMS_TOP, ...MARQUEE_ITEMS_TOP].map((item, idx) => (
                <div key={idx} className="shrink-0">
                  {item.type === 'photo' ? (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden relative shadow-lg shadow-black/5 group hover:scale-105 transition-transform">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-4xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5 flex flex-col items-center justify-center text-center p-3 hover:scale-105 transition-transform">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-md ${
                        item.icon === 'Moon' ? 'bg-blue-400 text-white' :
                        item.icon === 'Zap' ? 'bg-orange-500 text-white' :
                        'bg-purple-500 text-white'
                      }`}>
                        {item.icon === 'Moon' && <Moon className="w-5 h-5 fill-current" />}
                        {item.icon === 'Zap' && <Zap className="w-5 h-5 fill-current" />}
                        {(!item.icon || (item.icon !== 'Moon' && item.icon !== 'Zap')) && <Sparkles className="w-5 h-5 fill-current" />}
                      </div>
                      <h5 className="text-[11px] sm:text-xs font-bold text-[#131515] leading-tight">{item.title}</h5>
                      <p className="text-[10px] text-[#494D4D] font-medium mt-1">{item.subtitle}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Marquee Row (Moving Right) */}
          <div className="relative w-full overflow-hidden mask-gradient-x">
            <div className="animate-marquee-right flex gap-6">
              {[...MARQUEE_ITEMS_BOTTOM, ...MARQUEE_ITEMS_BOTTOM, ...MARQUEE_ITEMS_BOTTOM].map((item, idx) => (
                <div key={idx} className="shrink-0">
                  {item.type === 'photo' ? (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden relative shadow-lg shadow-black/5 group hover:scale-105 transition-transform">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-4xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5 flex flex-col items-center justify-center text-center p-3 hover:scale-105 transition-transform">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-md ${
                        item.icon === 'CheckCircle2' ? 'bg-green-500 text-white' :
                        item.icon === 'Droplets' ? 'bg-cyan-500 text-white' :
                        'bg-pink-500 text-white'
                      }`}>
                        {item.icon === 'CheckCircle2' && <CheckCircle2 className="w-5 h-5 fill-current" />}
                        {item.icon === 'Droplets' && <Droplets className="w-5 h-5 fill-current" />}
                        {(!item.icon || (item.icon !== 'CheckCircle2' && item.icon !== 'Droplets')) && <Sparkles className="w-5 h-5 fill-current" />}
                      </div>
                      <h5 className="text-[11px] sm:text-xs font-bold text-[#131515] leading-tight">{item.title}</h5>
                      <p className="text-[10px] text-[#494D4D] font-medium mt-1">{item.subtitle}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Center iPhone Frame (Highest Z-Index Focus) */}
        <div className="relative z-20 my-4 sm:my-8 scale-95 sm:scale-100 transition-transform">
          
          {/* Realistic Phone Bezel */}
          <div className="w-75 sm:w-[320px] bg-neutral-900 p-3.5 rounded-[48px] shadow-2xl border-4 border-neutral-800 ring-1 ring-black/30">
            
            {/* Top Notch */}
            <div className="w-28 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
            </div>

            {/* App Screen Container */}
            <div className="bg-neutral-950 text-white rounded-[36px] p-4 text-left overflow-hidden border border-white/10 shadow-inner">
              
              {/* Screen Title */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Weekly Overview</h4>
                  <p className="text-[10px] text-neutral-400 font-medium">Your progress across the week</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-emerald-300 font-bold">
                  86% this week
                </span>
              </div>

              {/* Area Chart Simulation */}
              <div className="bg-neutral-900/80 rounded-2xl p-3 border border-white/5 mb-4">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <TrendingUp className="w-3 h-3" /> +14% vs last week
                  </span>
                  <span>M T W T F S S</span>
                </div>

                {/* SVG Area Chart Graphic */}
                <div className="h-24 w-full relative">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,80 Q 50,20 100,50 T 200,30 T 300,10 L 300,100 L 0,100 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M 0,80 Q 50,20 100,50 T 200,30 T 300,10"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Data Points */}
                    <circle cx="100" cy="50" r="4" fill="#F97316" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="200" cy="30" r="4" fill="#F97316" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="300" cy="10" r="5" fill="#22C55E" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Two Stat Tiles */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xl font-extrabold text-white">12</span>
                  <p className="text-[10px] text-neutral-400 font-medium">Streaks completed</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xl font-extrabold text-white">07</span>
                  <p className="text-[10px] text-neutral-400 font-medium">Focused sessions</p>
                </div>
              </div>

              {/* Routine Stacks Bar */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="font-bold text-white text-[11px]">Routine Stacks</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold">4 active</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Bottom Download Banner with Cloud Overlay */}
      <div className="relative mt-24 pt-20 pb-16 px-4 bg-white border-t border-black/5">
        {/* Subtle Cloud Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply">
          <img 
            src="https://images.unsplash.com/photo-1579001156828-5690325d74d2?q=80&w=1200&auto=format&fit=crop"
            alt="Clouds"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-30">
          {/* Rating Pill */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-black/5 shadow-md mb-6">
            <Star className="w-4 h-4 text-orange-400 fill-current" />
            <span className="text-[13px] font-extrabold text-[#131515]">
              4.7 rating <span className="text-[#494D4D] font-medium">(based on 125 reviews)</span>
            </span>
          </div>

          <p className="text-lg text-[#131515] font-semibold mb-8 max-w-xl mx-auto leading-relaxed">
            Stay consistent with a system that fits into real life. Simple cards, clear routines, and gentle nudges help you build progress that lasts.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAppModal()}
              onMouseEnter={() => setHovered('iphone')}
              onMouseLeave={() => setHovered(null)}
              className="px-8 py-4 rounded-[20px] bg-[#131515] hover:bg-black text-white text-[15px] font-bold shadow-xl transition-all hover:scale-95 active:scale-90 flex items-center gap-3"
            >
              <Apple className="w-5 h-5 fill-current" />
              <RollingText
                text="Download for iPhone"
                autoPlay={hovered === 'iphone'}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#FFFFFF"
                font={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.2em' }}
              />
            </button>
            
            <button
              onClick={() => onOpenAppModal()}
              onMouseEnter={() => setHovered('android')}
              onMouseLeave={() => setHovered(null)}
              className="px-8 py-4 rounded-[20px] bg-[#EAEAEA] hover:bg-[#D9D9D9] text-[#131515] text-[15px] font-bold shadow-sm transition-all hover:scale-95 active:scale-90 flex items-center gap-3"
            >
              <Play className="w-4 h-4 fill-current text-[#131515]" />
              <RollingText
                text="Download for Android"
                autoPlay={hovered === 'android'}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#131515"
                font={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.2em' }}
              />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}


