import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = "https://cdn.pixabay.com/audio/2022/03/10/audio_4f0ee99b85.mp3";
    audio.loop = true;
    audio.volume = volume;
    audio.preload = "auto";
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });
    
    audio.addEventListener('error', () => {
      audio.src = "https://cdn.pixabay.com/audio/2023/03/13/audio_6d5dd3c944.mp3";
      audio.load();
    });
    
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const startMusic = async () => {
      if (audioRef.current && isLoaded && !userInteracted) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setUserInteracted(true);
        } catch (err) {
          console.log('Autoplay blocked, waiting for user interaction');
        }
      }
    };

    const handleInteraction = async () => {
      if (!userInteracted && isLoaded && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setUserInteracted(true);
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
        } catch (err) {
          console.log('Failed to start music:', err);
        }
      }
    };

    if (isLoaded && !userInteracted) {
      startMusic();
      document.addEventListener('click', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);
    }

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [isLoaded, userInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current || !isLoaded) return;

    if (isPlaying) {
      audioRef.current.pause();
      localStorage.setItem('runesMusicPlaying', 'false');
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        localStorage.setItem('runesMusicPlaying', 'true');
        setIsPlaying(true);
      } catch (err) {
        console.log('Play prevented:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl wooden-button backdrop-blur-lg shadow-2xl">
      <Button
        onClick={togglePlay}
        size="sm"
        variant="ghost"
        className="h-10 w-10 rounded-full hover:scale-110 transition-transform"
        disabled={!isLoaded}
      >
        <Icon name={isPlaying ? "Pause" : "Play"} className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2 min-w-[120px]">
        <Icon name="Volume2" className="h-4 w-4 text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground font-cormorant">
        <Icon name="Music" className="h-4 w-4" />
        <span className="whitespace-nowrap">Звуки природы</span>
      </div>
    </div>
  );
}