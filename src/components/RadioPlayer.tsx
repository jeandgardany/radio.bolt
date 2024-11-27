import React from 'react';
import { useSelector } from 'react-redux';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { RootState } from '../store';

const RadioPlayer = () => {
  const { isPlaying, volume, currentTime, duration, play, pause, setVolume } = useAudioPlayer();
  const currentTrack = useSelector((state: RootState) => state.radio.stats.currentSong);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-radio-blue border-t border-radio-accent">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Info da Música */}
          <div className="flex-1">
            <h3 className="text-radio-text font-medium">{currentTrack || 'Nenhuma música tocando'}</h3>
            <p className="text-radio-text-secondary text-sm">Rádio Gospel Online</p>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-4">
            <button
              onClick={isPlaying ? pause : play}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-radio-light text-white hover:bg-opacity-80"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="text-radio-text-secondary hover:text-radio-text"
              >
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-2">
          <div className="h-1 bg-radio-accent rounded-full">
            <div
              className="h-full bg-radio-light rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;