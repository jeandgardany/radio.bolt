import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RadioState {
  stats: {
    listeners: number;
    uptime: string;
    currentSong: string;
    nextSong: string;
    schedule: Array<{
      time: string;
      program: string;
    }>;
  };
  isLive: boolean;
  volume: number;
}

const initialState: RadioState = {
  stats: {
    listeners: 0,
    uptime: '00:00:00',
    currentSong: 'Nenhuma música tocando',
    nextSong: 'Nenhuma música na fila',
    schedule: []
  },
  isLive: false,
  volume: 1
};

export const radioSlice = createSlice({
  name: 'radio',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<RadioState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setLiveStatus: (state, action: PayloadAction<boolean>) => {
      state.isLive = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    }
  }
});

export const { updateStats, setLiveStatus, setVolume } = radioSlice.actions;

export default radioSlice.reducer;