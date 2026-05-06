import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

// We use global event dispatching for Phaser to listen to React UI inputs
const dispatchControl = (action: string, value: boolean) => {
  window.dispatchEvent(new CustomEvent('car-control', { detail: { action, value } }));
};

export const TouchControls: React.FC = () => {
  const [gear, setGear] = useState<'D' | 'R'>('D');

  const handleGearToggle = () => {
    const nextGear = gear === 'D' ? 'R' : 'D';
    setGear(nextGear);
    dispatchControl('gear', nextGear === 'R');
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Steering Controls (Left Side) */}
      <div className="absolute bottom-8 left-8 flex gap-4 pointer-events-auto">
        <ControlButton 
          onStart={() => dispatchControl('left', true)} 
          onEnd={() => dispatchControl('left', false)}
          className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
        >
          <ArrowLeft size={40} />
        </ControlButton>
        <ControlButton 
          onStart={() => dispatchControl('right', true)} 
          onEnd={() => dispatchControl('right', false)}
          className="w-20 h-20 bg-slate-800/80 rounded-2xl flex items-center justify-center border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
        >
          <ArrowRight size={40} />
        </ControlButton>
      </div>

      {/* Drive Controls (Right Side) */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-6 pointer-events-auto">
        {/* Gear Shifter */}
        <button 
          onClick={handleGearToggle}
          className={`w-16 h-24 rounded-2xl border-4 flex flex-col items-center justify-center font-black text-2xl transition-colors ${
            gear === 'D' ? 'border-green-500 bg-green-500/20 text-green-400' : 'border-red-500 bg-red-500/20 text-red-400'
          }`}
        >
          <div className={`transition-opacity ${gear === 'D' ? 'opacity-100' : 'opacity-30'}`}>D</div>
          <div className="h-4 w-1 bg-white/20 my-1 rounded-full" />
          <div className={`transition-opacity ${gear === 'R' ? 'opacity-100' : 'opacity-30'}`}>R</div>
        </button>

        <div className="flex gap-4">
          {/* Brake / Slow */}
          <ControlButton 
            onStart={() => dispatchControl('brake', true)} 
            onEnd={() => dispatchControl('brake', false)}
            className="w-20 h-20 bg-red-900/80 rounded-2xl flex items-center justify-center border-b-4 border-red-950 active:border-b-0 active:translate-y-1 transition-all"
          >
            <ChevronDown size={40} />
          </ControlButton>

          {/* Gas */}
          <ControlButton 
            onStart={() => dispatchControl('gas', true)} 
            onEnd={() => dispatchControl('gas', false)}
            className="w-24 h-24 bg-green-600/80 rounded-2xl flex items-center justify-center border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
          >
            <ChevronUp size={48} />
          </ControlButton>
        </div>
      </div>
    </div>
  );
};

interface ControlButtonProps {
  children: React.ReactNode;
  onStart: () => void;
  onEnd: () => void;
  className?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ children, onStart, onEnd, className }) => {
  return (
    <button
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={(e) => { e.preventDefault(); onStart(); }}
      onTouchEnd={(e) => { e.preventDefault(); onEnd(); }}
      className={className}
    >
      {children}
    </button>
  );
};