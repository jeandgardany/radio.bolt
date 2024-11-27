import { Howl } from 'howler';

class AudioService {
  private currentSound: Howl | null = null;
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private subscribers: ((state: any) => void)[] = [];

  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  subscribe(callback: (state: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    const state = {
      isPlaying: this.currentSound?.playing() || false,
      currentTime: this.currentSound?.seek() || 0,
      duration: this.currentSound?.duration() || 0
    };
    this.subscribers.forEach(callback => callback(state));
  }

  playAudio(url: string) {
    if (this.currentSound) {
      this.currentSound.stop();
    }

    this.currentSound = new Howl({
      src: [url],
      html5: true,
      onplay: () => this.notify(),
      onend: () => this.notify(),
      onpause: () => this.notify(),
      onstop: () => this.notify()
    });

    this.currentSound.play();
  }

  stopAudio() {
    this.currentSound?.stop();
  }

  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
    this.notify();
  }
}

export const audioService = new AudioService();