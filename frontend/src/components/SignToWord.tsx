import React from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";

export default function SignToWord() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full flex-col group/design-root">
      {/* Camera Viewport (Background) */}
      <div className="absolute inset-0 z-0 bg-black">
        <Webcam
          audio={false}
          className="absolute inset-0 h-full w-full object-cover"
          videoConstraints={{
            facingMode: "user"
          }}
        />
        {/* Dark Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-12">
        <button onClick={() => navigate(-1)}  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 active:scale-95 transition-all hover:bg-black/40">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-black/40 backdrop-blur-md border border-neon-teal/30 pl-3 pr-5 shadow-lg shadow-neon-teal/10">
          <span className="material-symbols-outlined text-neon-teal animate-pulse text-[20px]">graphic_eq</span>
          <p className="text-white text-sm font-medium tracking-wide">Detecting Hand...</p>
        </div>
        <div className="w-12" />
      </div>

      {/* Central Focus Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none pb-32">
        <div className="relative w-[70%] aspect-[3/4] max-w-sm rounded-xl border-2 border-dashed border-neon-teal/60 bg-neon-teal/5">
          {/* Corner Indicators */}
          <div className="absolute -top-[2px] -left-[2px] h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-neon-teal" />
          <div className="absolute -top-[2px] -right-[2px] h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-neon-teal" />
          <div className="absolute -bottom-[2px] -left-[2px] h-6 w-6 rounded-bl-xl border-l-4 border-b-4 border-neon-teal" />
          <div className="absolute -bottom-[2px] -right-[2px] h-6 w-6 rounded-br-xl border-r-4 border-b-4 border-neon-teal" />
          {/* Animated Scanning Line */}
          <div className="absolute left-2 right-2 h-0.5 bg-neon-teal shadow-[0_0_15px_#14b8a6] animate-scan" />
          {/* Helper Text */}
          <div className="absolute -bottom-16 w-full flex justify-center">
            <p className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
              Align hand within frame
            </p>
          </div>
        </div>
      </div>

      {/* Result Bottom Sheet */}
      <div className="absolute bottom-0 left-0 z-30 w-full">
        <div className="flex flex-col bg-white dark:bg-[#1A1D1D] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)] p-6 pb-8 transition-colors">
          {/* Handle */}
          <div className="flex w-full items-center justify-center pb-6">
            <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          {/* Content Grid */}
          <div className="flex items-center justify-between gap-4 mb-8">
            {/* Text Result */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Detected Sign</span>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">HELLO</h1>
            </div>
            {/* Confidence Score Ring */}
            <div className="relative flex items-center justify-center size-[72px]">
              <svg className="h-full w-full rotate-[-90deg]" viewBox="0 0 36 36">
                <path className="text-gray-100 dark:text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-neon-teal drop-shadow-[0_0_4px_rgba(20,184,166,0.4)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="98, 100" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">98%</span>
              </div>
            </div>
          </div>
          {/* Primary Action Button */}
          <button className="relative w-full overflow-hidden rounded-2xl bg-primary p-4 shadow-xl shadow-primary/20 active:scale-[0.99] transition-all group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/20">
                <span className="material-symbols-outlined text-white text-[20px]">volume_up</span>
              </div>
              <span className="text-lg font-bold text-white tracking-wide">Confirm / Speak</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
