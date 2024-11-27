import { sequelize } from '../config/database';

class PlaylistService {
  async createPlaylist(data: any) {
    try {
      const result = await sequelize.query(
        'INSERT INTO playlists (name, description, genre) VALUES (?, ?, ?)',
        {
          replacements: [data.name, data.description, data.genre],
          type: 'INSERT'
        }
      );
      return result;
    } catch (error) {
      console.error('Erro ao criar playlist:', error);
      throw error;
    }
  }

  async getPlaylists() {
    try {
      const [results] = await sequelize.query('SELECT * FROM playlists');
      return results;
    } catch (error) {
      console.error('Erro ao buscar playlists:', error);
      throw error;
    }
  }

  async addSongToPlaylist(playlistId: number, songId: number) {
    try {
      await sequelize.query(
        'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
        {
          replacements: [playlistId, songId],
          type: 'INSERT'
        }
      );
    } catch (error) {
      console.error('Erro ao adicionar música à playlist:', error);
      throw error;
    }
  }
}

export const playlistService = new PlaylistService();