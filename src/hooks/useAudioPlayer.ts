import { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const unsubscribe = audioService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
    });

    return () => unsubscribe();
  }, []);

  const play = (url: string) => {
    audioService.playAudio(url);
    setIsPlaying(true);
  };

  const pause = () => {
    audioService.stopAudio();
    setIsPlaying(false);
  };

  const setAudioVolume = (value: number) => {
    audioService.setVolume(value);
    setVolume(value);
  };

  return {
    isPlaying,
    volume,
    currentTime,
    duration,
    play,
    pause,
    setVolume: setAudioVolume
  };
}