'use client'
import { useState, useRef } from "react";
import { Music } from "lucide-react";
const MusicPlayer = ({ url }: { url?: string }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toggle = () => {
    if(!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  }
  if (!url) return null;
  return (
    <div onClick={toggle} className={`fixed top-4 right-4 z-50 p-2 bg-white/20 backdrop-blur rounded-full cursor-pointer ${playing ? 'animate-spin' : ''}`}>
      <audio ref={audioRef} src={url} loop />
      <Music className="text-white w-6 h-6" />
    </div>
  );
};
export default MusicPlayer;