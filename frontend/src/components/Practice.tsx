import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import Avatar3D from './Avatar3D';
import * as numbers from '../Animations/numbers';

export default function Practice() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('letters');
  const [selectedItem, setSelectedItem] = useState('A');
  const avatarRef = useRef<any>(null);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    if (avatarRef.current) {
      if (mode === 'numbers') {
        const numberMap: any = {
          '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR', '5': 'FIVE',
          '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE', '10': 'TEN'
        };
        avatarRef.current.performSign(numberMap[item]);
      } else {
        avatarRef.current.performSign(item);
      }
    }
  };

  const handleReplay = () => {
    handleItemClick(selectedItem);
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbersList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const numbersDisplay = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const items = mode === 'letters' ? letters : numbersDisplay;

  return (
    <div className="bg-background-light dark:bg-background-dark h-screen overflow-hidden flex flex-col">
      {/* Top Section - Avatar Stage */}
      <div className="relative bg-white dark:bg-[#1a2c2a] rounded-b-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-20 flex flex-col shrink-0 h-[45vh]">
        {/* Header */}
        <div className="flex items-center p-4 pt-6 pb-2 justify-between">
          <button onClick={() => navigate('/')} className="text-slate-800 dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Practice Studio</h2>
          <div className="size-10"></div>
        </div>

        {/* Stage Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative pb-6 px-6">
          {/* Letter Label */}
          <div className="mb-2">
            <span className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{selectedItem}</span>
          </div>

          {/* Avatar Container */}
          <div className="relative w-full h-[280px] flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl transform scale-75"></div>
            <div className="relative w-full h-full z-10">
              <Avatar3D ref={avatarRef} />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
            <button onClick={handleReplay} className="group flex items-center justify-center size-12 rounded-full bg-white dark:bg-background-dark shadow-md border border-slate-100 dark:border-white/10 text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-[24px] group-hover:rotate-[-45deg] transition-transform">replay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Controls */}
      <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="flex flex-col h-full px-4 pt-6 pb-4">
          {/* Mode Toggle */}
          <div className="flex justify-center w-full mb-6">
            <div className="flex h-12 w-full max-w-sm items-center justify-center rounded-full bg-slate-200/60 dark:bg-black/20 p-1">
              <button
                onClick={() => { setMode('letters'); setSelectedItem('A'); }}
                className={`h-full flex-1 flex items-center justify-center rounded-full transition-all font-medium text-sm ${
                  mode === 'letters' ? 'bg-primary shadow-md text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                A-Z Letters
              </button>
              <button
                onClick={() => { setMode('numbers'); setSelectedItem('1'); }}
                className={`h-full flex-1 flex items-center justify-center rounded-full transition-all font-medium text-sm ${
                  mode === 'numbers' ? 'bg-primary shadow-md text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                1-10 Numbers
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto pb-8">
            <div className="grid grid-cols-6 gap-3">
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => handleItemClick(item)}
                  className={`aspect-square flex items-center justify-center rounded font-semibold text-lg transition-all active:scale-95 ${
                    selectedItem === item
                      ? 'bg-primary shadow-md shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark text-white'
                      : 'bg-white dark:bg-[#1a2c2a] shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {mode === 'numbers' ? item : item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
