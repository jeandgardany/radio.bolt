import io from 'socket.io-client';
import { Howl } from 'howler';
import { store } from '../store';
import { updateStats } from '../store/radioSlice';

class StreamService {
  private socket: any;
  private currentStream: Howl | null = null;
  private playlist: string[] = [];
  private currentTrackIndex: number = 0;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to streaming server');
    });

    this.socket.on('trackChange', (data: any) => {
      store.dispatch(updateStats({ currentSong: data.title }));
    });

    this.socket.on('stats', (data: any) => {
      store.dispatch(updateStats(data));
    });
  }

  startStream() {
    // Parar stream atual se existir
    if (this.currentStream) {
      this.currentStream.stop();
    }

    // Criar novo stream
    this.currentStream = new Howl({
      src: ['http://localhost:3000/stream'],
      html5: true,
      format: ['mp3'],
      autoplay: true,
      volume: 1.0,
      onplay: () => {
        this.socket.emit('streamStarted');
      },
      onstop: () => {
        this.socket.emit('streamStopped');
      },
      onend: () => {
        this.playNext();
      }
    });
  }

  stopStream() {
    if (this.currentStream) {
      this.currentStream.stop();
      this.currentStream = null;
    }
    this.socket.emit('streamStopped');
  }

  setVolume(volume: number) {
    if (this.currentStream) {
      this.currentStream.volume(volume);
    }
  }

  async loadPlaylist(folderId: string) {
    try {
      const response = await fetch(`/api/playlist/${folderId}`);
      const data = await response.json();
      this.playlist = data.tracks;
      this.currentTrackIndex = 0;
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
  }

  private playNext() {
    if (this.playlist.length === 0) return;

    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    const nextTrack = this.playlist[this.currentTrackIndex];
    
    this.socket.emit('trackChange', {
      title: nextTrack,
      index: this.currentTrackIndex
    });
  }

  // Métodos para controle ao vivo
  startLiveStream(micStream: MediaStream) {
    // Implementar lógica para transmissão ao vivo
    this.socket.emit('startLive', { stream: micStream });
  }

  stopLiveStream() {
    this.socket.emit('stopLive');
  }
}

export const streamService = new StreamService();