import React from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface MenuProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onStart, isMuted, onToggleMute }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    >
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600 italic tracking-tighter uppercase drop-shadow-2xl">
          PARK MASTER
        </h1>
        <p className="text-blue-300 font-medium tracking-widest mt-2">ULTIMATE TOUCH DRIVING</p>
      </motion.div>

      <div className="flex flex-col gap-6 w-64">
        <button 
          onClick={onStart}
          className="group relative flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-slate-900 h-16 rounded-2xl font-black text-2xl transition-all shadow-[0_8px_0_rgb(180,120,0)] active:shadow-none active:translate-y-2 overflow-hidden"
        >
          <Play className="mr-2 fill-current" size={28} />
          START GAME
        </button>

        <button 
          onClick={onToggleMute}
          className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white h-16 rounded-2xl font-bold text-xl transition-all shadow-[0_8px_0_rgb(30,30,30)] active:shadow-none active:translate-y-2"
        >
          {isMuted ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
          {isMuted ? 'UNMUTE' : 'MUTE'}
        </button>
      </div>

      <div className="absolute bottom-10 text-slate-400 text-sm font-medium">
        OPTIMIZED FOR TOUCH & MOBILE
      </div>
    </motion.div>
  );
};