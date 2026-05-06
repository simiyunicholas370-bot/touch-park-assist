import React, { useState, useEffect } from 'react';
import { Menu } from './components/Menu';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { PhaserGame } from './game/PhaserGame';
import { useSound } from './hooks/useSound';
import { AnimatePresence, motion } from 'framer-motion';

export type GameState = 'START' | 'PLAYING' | 'WON' | 'LOST';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const { isMuted, toggleMute, playSound } = useSound();

  const handleStart = () => {
    setGameState('PLAYING');
    playSound('click');
  };

  const handleWin = () => {
    setGameState('WON');
    setScore((prev) => prev + 100);
    playSound('win');
  };

  const handleLose = () => {
    setGameState('LOST');
    playSound('collision');
  };

  const handleRestart = () => {
    setGameState('PLAYING');
    playSound('click');
  };

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1);
    setGameState('PLAYING');
    playSound('click');
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-sans text-white select-none">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #0f172a;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          touch-action: none;
        }
        canvas {
          display: block;
        }
      `}</style>
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <PhaserGame 
          gameState={gameState} 
          onWin={handleWin} 
          onLose={handleLose} 
          level={level}
        />
      </div>

      {/* UI Overlays */}
      <AnimatePresence>
        {gameState === 'START' && (
          <Menu onStart={handleStart} isMuted={isMuted} onToggleMute={toggleMute} />
        )}

        {gameState === 'PLAYING' && (
          <>
            <HUD level={level} score={score} isMuted={isMuted} onToggleMute={toggleMute} />
            <TouchControls />
          </>
        )}

        {(gameState === 'WON' || gameState === 'LOST') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="bg-slate-800 p-8 rounded-2xl border-4 border-yellow-500 text-center shadow-2xl max-w-sm w-full mx-4">
              <h2 className={`text-4xl font-bold mb-4 ${gameState === 'WON' ? 'text-green-400' : 'text-red-400'}`}>
                {gameState === 'WON' ? 'PARKED!' : 'CRASHED!'}
              </h2>
              <p className="text-xl mb-6">Level: {level} | Score: {score}</p>
              <div className="flex flex-col gap-4">
                {gameState === 'WON' ? (
                  <button 
                    onClick={handleNextLevel}
                    className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold text-xl transition-transform active:scale-95 shadow-lg"
                  >
                    NEXT LEVEL
                  </button>
                ) : (
                  <button 
                    onClick={handleRestart}
                    className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-bold text-xl transition-transform active:scale-95 shadow-lg"
                  >
                    TRY AGAIN
                  </button>
                )}
                <button 
                  onClick={() => setGameState('START')}
                  className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold text-xl transition-transform active:scale-95 shadow-lg"
                >
                  MAIN MENU
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;