import React, { useState } from 'react';
import { X, Apple, Play, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import RollingText from './RollingText';

export default function AppModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-black/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-neutral-900 mb-2">You're on the list!</h3>
            <p className="text-xs text-neutral-600 font-medium mb-6">
              We've sent an instant download link to <span className="font-bold text-neutral-900">{email}</span>.
            </p>
            <button
              onClick={onClose}
              onMouseEnter={() => setHoveredButton('close')}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold"
            >
              <RollingText
                text="Close"
                autoPlay={hoveredButton === 'close'}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.02}
                textColor="#FFFFFF"
                font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
              />
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Get SkillSync Today</span>
            </div>

            <h3 className="text-2xl font-extrabold text-neutral-900 mb-2">Download SkillSync</h3>
            <p className="text-xs text-neutral-600 font-medium mb-6">
              Start building steady habits with a layout that keeps your days calm and intentional.
            </p>

            {/* Store Download Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSubmitted(true)}
                onMouseEnter={() => setHoveredButton('ios')}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-3 transition-all hover:scale-95"
              >
                <Apple className="w-4 h-4 fill-current" />
                <RollingText
                  text="Download on App Store (iOS)"
                  autoPlay={hoveredButton === 'ios'}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#FFFFFF"
                  font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
                />
              </button>

              <button
                onClick={() => setSubmitted(true)}
                onMouseEnter={() => setHoveredButton('android')}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center justify-center gap-3 transition-all hover:scale-95 border border-black/5"
              >
                <Play className="w-3.5 h-3.5 fill-current text-neutral-800" />
                <RollingText
                  text="Get it on Google Play (Android)"
                  autoPlay={hoveredButton === 'android'}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#171717"
                  font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
                />
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-neutral-200"></div>
              <span className="shrink mx-3 text-[10px] text-neutral-400 font-bold uppercase">Or send download link</span>
              <div className="grow border-t border-neutral-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 rounded-full bg-neutral-100 border border-black/5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
              />
              <button
                type="submit"
                onMouseEnter={() => setHoveredButton('send')}
                onMouseLeave={() => setHoveredButton(null)}
                className="px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-bold shrink-0"
              >
                <RollingText
                  text="Send"
                  autoPlay={hoveredButton === 'send'}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.02}
                  textColor="#0a0a0a"
                  font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
                />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}



