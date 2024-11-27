import React, { useState } from 'react';
import VolumeControl from '../components/Studio/VolumeControl';
import EqualizerBand from '../components/Studio/EqualizerBand';
import VoiceEffects from '../components/Studio/VoiceEffects';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { IoMdMic, IoMdRadio } from 'react-icons/io';
import { FaMusic, FaBroadcastTower } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Studio = () => {
  const { isPlaying, volume, setVolume } = useAudioPlayer();
  const [isLive, setIsLive] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const [volumes, setVolumes] = useState({
    master: 1,
    music: 0.8,
    mic: 0.7,
    jingles: 0.8
  });

  const [eq, setEq] = useState({
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0
  });

  const handleVolumeChange = (channel: string, value: number) => {
    setVolumes(prev => ({ ...prev, [channel]: value }));
  };

  const handleEqChange = (band: string, value: number) => {
    setEq(prev => ({ ...prev, [band]: value }));
  };

  const toggleLive = () => {
    setIsLive(!isLive);
    toast.success(isLive ? 'Transmissão encerrada' : 'Transmissão iniciada!');
  };

  const toggleMic = () => {
    setMicActive(!micActive);
    toast.info(micActive ? 'Microfone desativado' : 'Microfone ativado');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Studio</h1>
        <p className="text-blue-200">Controle total da sua transmissão</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Painel Principal */}
        <div className="xl:col-span-8 space-y-6">
          {/* Status e Controles Principais */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={toggleLive}
                className={`p-4 rounded-lg flex flex-col items-center justify-center ${
                  isLive ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <FaBroadcastTower className="text-2xl mb-2" />
                <span>{isLive ? 'NO AR' : 'INICIAR'}</span>
              </button>

              <button
                onClick={toggleMic}
                className={`p-4 rounded-lg flex flex-col items-center justify-center ${
                  micActive ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <IoMdMic className="text-2xl mb-2" />
                <span>{micActive ? 'MIC ON' : 'MIC OFF'}</span>
              </button>

              <div className="p-4 rounded-lg bg-white/5 flex flex-col items-center justify-center">
                <IoMdRadio className="text-2xl mb-2 text-blue-400" />
                <span className="text-gray-300">OUVINTES</span>
                <span className="text-xl font-bold text-white">247</span>
              </div>

              <div className="p-4 rounded-lg bg-white/5 flex flex-col items-center justify-center">
                <FaMusic className="text-2xl mb-2 text-purple-400" />
                <span className="text-gray-300">PLAYLIST</span>
                <span className="text-xl font-bold text-white">32</span>
              </div>
            </div>
          </div>

          {/* Mixer de Áudio */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Mixer de Áudio</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(volumes).map(([channel, value]) => (
                <VolumeControl
                  key={channel}
                  label={channel.charAt(0).toUpperCase() + channel.slice(1)}
                  value={value}
                  onChange={(val) => handleVolumeChange(channel, val)}
                />
              ))}
            </div>
          </div>

          {/* Equalizador */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Equalizador</h2>
            <div className="flex justify-between items-end px-8">
              {Object.entries(eq).map(([band, value]) => (
                <EqualizerBand
                  key={band}
                  frequency={band}
                  gain={value}
                  onChange={(val) => handleEqChange(band, val)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="xl:col-span-4 space-y-6">
          <VoiceEffects />
        </div>
      </div>
    </div>
  );
};

export default Studio;