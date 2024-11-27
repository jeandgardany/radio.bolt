import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { playlistService } from '../../services/playlistService';
import { toast } from 'react-toastify';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

const PlaylistManager: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await playlistService.getPlaylists();
      setPlaylists(data);
    } catch (error) {
      toast.error('Erro ao carregar playlists');
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(songs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSongs(items);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        <div className="space-y-2">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist.id)}
              className={`w-full text-left p-3 rounded-lg ${
                selectedPlaylist === playlist.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {playlist.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Músicas na Playlist</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="songs">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {songs.map((song, index) => (
                  <Draggable
                    key={song.id}
                    draggableId={song.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{song.title}</h3>
                            <p className="text-sm text-gray-500">{song.artist}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {song.duration}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default PlaylistManager;