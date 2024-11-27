import React from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface AudioPlayerProps {
  src: string;
  onPlay?: () => void;
  onPause?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onPlay, onPause }) => {
  const { volume, setVolume } = useAudioPlayer();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <H5AudioPlayer
        src={src}
        onPlay={onPlay}
        onPause={onPause}
        volume={volume}
        onVolumeChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
        showJumpControls={false}
        layout="horizontal"
        customProgressBarSection={[
          "CURRENT_TIME",
          "PROGRESS_BAR",
          "DURATION",
        ]}
        customControlsSection={[
          "MAIN_CONTROLS",
          "VOLUME_CONTROLS",
        ]}
        autoPlayAfterSrcChange={false}
        className="radio-player"
      />
    </div>
  );
};

export default AudioPlayer;