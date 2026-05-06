import React from 'react';
import { Volume2, VolumeX, Trophy, Map } from 'lucide-react';

interface HUDProps {
  level: number;
  score: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({ level, score, isMuted, onToggleMute }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-40">
      <div className="flex flex-col gap-2 pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
          <Map className="text-yellow-400" size={20} />
          <span className="font-bold text-lg">LEVEL {level}</span>
        </div>
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
          <Trophy className="text-green-400" size={20} />
          <span className="font-bold text-lg">{score.toString().padStart(5, '0')}</span>
        </div>
      </div>

      <button 
        onClick={onToggleMute}
        className="pointer-events-auto bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
};