import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_4f0ee99b85.mp3");
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const savedIsPlaying = localStorage.getItem('runesMusicPlaying');
    if (savedIsPlaying === 'true') {
      setIsPlaying(true);
      audio.play().catch(err => console.log('Autoplay prevented:', err));
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      localStorage.setItem('runesMusicPlaying', 'false');
    } else {
      audioRef.current.play().catch(err => console.log('Play error:', err));
      localStorage.setItem('runesMusicPlaying', 'true');
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl wooden-button backdrop-blur-lg shadow-2xl">
      <Button
        onClick={togglePlay}
        size="sm"
        variant="ghost"
        className="h-10 w-10 rounded-full hover:scale-110 transition-transform"
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
