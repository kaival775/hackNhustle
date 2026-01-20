import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function Translator() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setTextInput('');
      setShowTextInput(false);
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const handleTextInputToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    }
    setShowTextInput(!showTextInput);
  };

  const handleReset = () => {
    SpeechRecognition.abortListening();
    resetTranscript();
    setTextInput('');
  };

  const displayText = textInput || transcript;

  console.log('Transcript:', transcript, 'Listening:', listening, 'DisplayText:', displayText);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="relative flex h-full w-full max-w-md flex-col bg-white dark:bg-background-dark shadow-2xl overflow-hidden group/design-root">
      {/* Top Half: Input Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6 pb-8 bg-surface-light dark:bg-surface-dark relative z-10 rounded-b-[3rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button onClick={() => navigate('/')} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-slate-700 dark:text-white text-xl">arrow_back</span>
          </button>
        </div>

        {/* Language Pill */}
        <div className="mt-4 mb-auto">
          <button className="flex h-10 items-center justify-center gap-x-2 rounded-full bg-background-light dark:bg-background-dark/50 border border-slate-100 dark:border-slate-700 pl-4 pr-3 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="text-[#111817] dark:text-white text-sm font-medium leading-normal">English</span>
            <span className="material-symbols-outlined text-primary text-lg">sync_alt</span>
            <span className="text-[#111817] dark:text-white text-sm font-medium leading-normal">ISL</span>
            <span className="material-symbols-outlined text-slate-400 text-xl ml-1">expand_more</span>
          </button>
        </div>

        {/* Main Microphone Interaction */}
        <div className="flex flex-col items-center justify-center gap-6 mb-8 relative w-full px-6">
          <h1 className="text-[#111817] dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">
            {listening ? 'Listening...' : showTextInput ? 'Type Your Text' : 'Tap to Listen'}
          </h1>
          
          {/* Text Input Field */}
          {showTextInput && (
            <div className="w-full max-w-sm">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
          )}

          {!showTextInput && (
            <div className="relative flex items-center justify-center">
              {/* Ripple Effects */}
              {listening && (
                <>
                  <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="absolute w-24 h-24 bg-primary/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] delay-75" />
                </>
              )}
              {/* Main Button */}
              <button onClick={handleMicClick} className={`relative z-10 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full ${listening ? 'bg-red-500' : 'bg-primary'} text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300`}>
                <span className="material-symbols-outlined text-4xl">{listening ? 'stop' : 'mic'}</span>
              </button>
            </div>
          )}
          
          {/* Transcript Display - Moved Below Button */}
          {displayText && !showTextInput && (
            <div className="bg-white absolute top-[230px] dark:bg-slate-800 rounded-2xl px-6 py-4 shadow-lg border border-slate-200 dark:border-slate-700 max-w-sm w-full">
              <p className="text-slate-800 dark:text-white text-base font-medium text-center">{displayText}</p>
            </div>
          )}
          
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
            {listening ? 'Tap to stop' : showTextInput ? 'Type your message above' : 'Tap microphone to start'}
          </p>
        </div>
      </div>

      {/* Bottom Half: Output & Avatar Area */}
      <div className="flex-[1.2] bg-gradient-to-b from-teal-50 to-teal-100 dark:from-background-dark dark:to-[#051a18] relative flex flex-col w-full -mt-8 pt-[9rem] rounded-t-[3rem] shadow-inner overflow-hidden">
        {/* Avatar Loading State */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full">
          {/* 3D Avatar Placeholder Container */}
          <div className="relative w-64 h-80 flex items-center justify-center">
            {/* Abstract geometric background for depth */}
            <div className="absolute bottom-0 w-48 h-12 bg-teal-900/10 dark:bg-teal-500/10 rounded-[100%] blur-xl transform scale-y-50" />
            {/* Skeleton Loader Body Shape */}
            <div className="w-40 h-72 bg-gradient-to-t from-teal-200/50 to-teal-100/50 dark:from-teal-800/30 dark:to-teal-900/30 rounded-[3rem] animate-pulse flex flex-col items-center relative overflow-hidden backdrop-blur-sm border border-white/20">
              {/* Shim effect */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {/* Head */}
              <div className="w-16 h-20 bg-teal-300/40 dark:bg-teal-600/40 rounded-[2rem] mt-6 mb-2" />
              {/* Torso */}
              <div className="w-24 h-28 bg-teal-300/40 dark:bg-teal-600/40 rounded-[2rem] mb-2" />
              {/* Arms Area */}
              <div className="flex gap-2">
                <div className="w-6 h-16 bg-teal-300/30 dark:bg-teal-600/30 rounded-full" />
                <div className="w-6 h-16 bg-teal-300/30 dark:bg-teal-600/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Floating Status Card */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-12">
            <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/10 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-800 dark:text-slate-100 text-sm font-semibold whitespace-nowrap">Sign Interpretation Loading...</p>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="w-full px-6 pb-8 pt-4">
          <div className="flex justify-between items-center bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-white/40 dark:border-white/10">
            {/* Keyboard Input */}
            <button onClick={handleTextInputToggle} className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors group ${showTextInput ? 'bg-primary/10' : ''}`}>
              <div className="p-2 rounded-full bg-transparent group-hover:bg-primary/10 transition-colors">
                <span className={`material-symbols-outlined text-2xl group-hover:text-primary ${showTextInput ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>keyboard</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type</span>
            </button>
            {/* Divider */}
            <div className="w-px h-8 bg-slate-300/50 dark:bg-white/10" />
            {/* Reset */}
            <button onClick={handleReset} className="flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors group">
              <div className="p-2 rounded-full bg-transparent group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl group-hover:text-primary">replay</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Reset</span>
            </button>
            {/* Divider */}
            <div className="w-px h-8 bg-slate-300/50 dark:bg-white/10" />
            {/* Slow Motion */}
            <button className="flex flex-1 flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors group">
              <div className="p-2 rounded-full bg-transparent group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl group-hover:text-primary">speed</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Speed</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
