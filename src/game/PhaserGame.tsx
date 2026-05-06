import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameState } from '../App';
import { MainScene } from './scenes/MainScene';

interface PhaserGameProps {
  gameState: GameState;
  onWin: () => void;
  onLose: () => void;
  level: number;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ gameState, onWin, onLose, level }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [MainScene],
      backgroundColor: '#0f172a',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.registry.set('onWin', onWin);
    game.registry.set('onLose', onLose);

    // Ensure state synchronization once scene is ready
    game.events.once('ready', () => {
      const scene = game.scene.getScene('MainScene') as MainScene;
      if (gameState === 'PLAYING') {
        scene.startLevel(level);
      }
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
      if (scene && scene.scene.isActive()) {
        if (gameState === 'PLAYING') {
          scene.startLevel(level);
        } else {
          scene.stopLevel();
        }
      }
    }
  }, [gameState, level]);

  return <div ref={containerRef} className="w-full h-full" />;
};