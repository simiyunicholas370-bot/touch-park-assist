import { useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

const SOUND_URLS = {
  bgm: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  collision: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
};

export const useSound = () => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('muted') === 'true';
  });

  const [sounds, setSounds] = useState<Record<string, Howl>>({});

  useEffect(() => {
    const newSounds: Record<string, Howl> = {
      bgm: new Howl({ src: [SOUND_URLS.bgm], loop: true, volume: 0.2 }),
      click: new Howl({ src: [SOUND_URLS.click], volume: 0.5 }),
      collision: new Howl({ src: [SOUND_URLS.collision], volume: 0.6 }),
      win: new Howl({ src: [SOUND_URLS.win], volume: 0.7 }),
    };

    setSounds(newSounds);

    return () => {
      Object.values(newSounds).forEach(s => s.unload());
    };
  }, []);

  useEffect(() => {
    if (sounds.bgm) {
      if (isMuted) {
        sounds.bgm.pause();
      } else {
        sounds.bgm.play();
      }
    }
  }, [isMuted, sounds.bgm]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      localStorage.setItem('muted', String(newState));
      Howler.mute(newState);
      return newState;
    });
  }, []);

  const playSound = useCallback((key: keyof typeof SOUND_URLS) => {
    if (sounds[key] && !isMuted) {
      sounds[key].play();
    }
  }, [sounds, isMuted]);

  return { isMuted, toggleMute, playSound };
};