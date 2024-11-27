import React, { useState, useEffect } from 'react';
import { FaFolder, FaMusic, FaPlus, FaEdit, FaTrash, FaPlay } from 'react-icons/fa';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import './MusicLibrary.css';

interface Folder {
  id: number;
  name: string;
  path: string;
  songs: Song[];
  createdAt?: string;
  updatedAt?: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  file: string;
}

const MusicLibrary: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFolderSongs = async (folderId: number) => {
    try {
      const response = await fetch(`/api/folders/${folderId}/songs`);
      if (!response.ok) throw new Error('Erro ao carregar músicas');
      const songs = await response.json();
      return songs;
    } catch (error) {
      console.error('Erro ao carregar músicas:', error);
      toast.error('Erro ao carregar músicas');
      return [];
    }
  };

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/folders');
      if (!response.ok) throw new Error('Erro ao carregar pastas');
      const data = await response.json();
      
      const foldersWithSongs = await Promise.all(
        data.map(async (folder: Folder) => {
          const songs = await loadFolderSongs(folder.id);
          return { ...folder, songs };
        })
      );
      
      setFolders(foldersWithSongs);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
      toast.error('Erro ao carregar pastas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleFolderSelect = async (folder: Folder) => {
    try {
      const songs = await loadFolderSongs(folder.id);
      const updatedFolder = { ...folder, songs };
      setSelectedFolder(updatedFolder);
      
      setFolders(prev => prev.map(f => 
        f.id === folder.id ? updatedFolder : f
      ));
    } catch (error) {
      console.error('Erro ao selecionar pasta:', error);
      toast.error('Erro ao carregar músicas da pasta');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedFolder) {
      toast.error('Selecione uma pasta primeiro');
      return;
    }

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('audio', file);
    });

    try {
      const response = await fetch(`/api/upload/${selectedFolder.id}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no upload');
      }

      const songs = await loadFolderSongs(selectedFolder.id);
      const updatedFolder = { ...selectedFolder, songs };
      
      setSelectedFolder(updatedFolder);
      setFolders(prev => prev.map(folder => 
        folder.id === selectedFolder.id ? updatedFolder : folder
      ));

      toast.success(`${files.length} música(s) importada(s) com sucesso!`);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(error.message || 'Erro ao fazer upload das músicas');
    } finally {
      setIsUploading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Nome da pasta é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar pasta');
      }

      const newFolder = await response.json();
      setFolders(prev => [...prev, { ...newFolder, songs: [] }]);
      setNewFolderName('');
      setShowNewFolderModal(false);
      toast.success('Pasta criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar pasta:', error);
      toast.error(error.message);
    }
  };
  const updateFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) {
      toast.error('Nome da pasta é obrigatório');
      return;
    }

    try {
      const response = await fetch(`/api/folders/${editingFolder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar pasta');
      }

      const updatedFolder = await response.json();

      // Atualiza a lista de pastas mantendo as músicas
      setFolders(prev => prev.map(folder => 
        folder.id === editingFolder.id
          ? { ...updatedFolder, songs: folder.songs }
          : folder
      ));

      // Se a pasta sendo editada é a selecionada, atualiza ela também
      if (selectedFolder?.id === editingFolder.id) {
        setSelectedFolder(prev => prev ? { ...prev, name: newFolderName } : null);
      }

      setEditingFolder(null);
      setNewFolderName('');
      setShowNewFolderModal(false);
      toast.success('Pasta atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar pasta:', error);
      toast.error(error.message || 'Erro ao atualizar pasta');
    }
  };

  const deleteFolder = async (folderId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pasta e todas as suas músicas?')) {
      return;
    }

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao excluir pasta');
      }

      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
      
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      toast.success('Pasta excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir pasta:', error);
      toast.error(error.message || 'Erro ao excluir pasta');
    }
  };

  const deleteSong = async (songId: number) => {
    if (!selectedFolder) return;

    if (!window.confirm('Tem certeza que deseja excluir esta música?')) {
      return;
    }

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao excluir música');

      const songs = await loadFolderSongs(selectedFolder.id);
      const updatedFolder = { ...selectedFolder, songs };
      
      setSelectedFolder(updatedFolder);
      setFolders(prev => prev.map(folder => 
        folder.id === selectedFolder.id ? updatedFolder : folder
      ));
      
      toast.success('Música excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir música:', error);
      toast.error('Erro ao excluir música');
    }
  };

  return (
    <div className="p-6 bg-radio-dark min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-radio-text mb-2">Biblioteca Musical</h1>
        <p className="text-radio-text-secondary">Organize e gerencie suas músicas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Pastas */}
        <div className="lg:col-span-4">
          <div className="bg-radio-blue rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-radio-text">Pastas</h2>
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center px-4 py-2 bg-radio-light text-white rounded-lg hover:bg-opacity-80 transition-colors"
                disabled={isLoading}
              >
                <FaPlus className="mr-2" />
                Nova Pasta
              </button>
            </div>

            <div className="space-y-2 folders-list">
              {folders.map(folder => (
                <div
                  key={folder.id}
                  className={classNames(
                    "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all",
                    selectedFolder?.id === folder.id
                      ? "bg-radio-light text-white"
                      : "bg-radio-accent text-radio-text-secondary hover:bg-opacity-80"
                  )}
                  onClick={() => handleFolderSelect(folder)}
                >
                  <div className="flex items-center flex-1">
                    <FaFolder className="mr-3" />
                    <div>
                      <span className="font-medium">{folder.name}</span>
                      <span className="ml-2 text-sm opacity-75">
                        ({folder.songs?.length || 0})
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFolder(folder);
                        setNewFolderName(folder.name);
                        setShowNewFolderModal(true);
                      }}
                      className="p-2 hover:text-radio-light transition-colors"
                      title="Editar pasta"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="p-2 hover:text-red-400 transition-colors"
                      title="Excluir pasta"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              {folders.length === 0 && (
                <div className="text-center py-8 text-radio-text-secondary">
                  <p>Nenhuma pasta criada</p>
                  <p className="text-sm mt-2">Clique em "Nova Pasta" para começar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Músicas */}
        <div className="lg:col-span-8">
          <div className="bg-radio-blue rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-radio-text">
                {selectedFolder ? `Músicas - ${selectedFolder.name}` : 'Selecione uma pasta'}
              </h2>
              
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {selectedFolder && (
                  <input
                    type="text"
                    placeholder="Pesquisar músicas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-radio-accent text-radio-text rounded-lg border-none focus:ring-radio-light w-full md:w-64"
                  />
                )}
                
                <label className={classNames(
                  "flex items-center px-4 py-2 bg-radio-light text-white rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer whitespace-nowrap",
                  (!selectedFolder || isUploading) && "opacity-50 cursor-not-allowed"
                )}>
                  <FaPlus className="mr-2" />
                  <span>{isUploading ? 'Importando...' : 'Importar Músicas'}</span>
                  <input
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={!selectedFolder || isUploading}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2 songs-list">
              {selectedFolder?.songs
                ?.filter(song => 
                  song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  song.artist.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(song => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-4 bg-radio-accent rounded-lg hover:bg-opacity-90 transition-all"
                  >
                    <div className="flex items-center flex-1">
                      <FaMusic className="text-radio-light mr-3" />
                      <div>
                        <h3 className="text-radio-text font-medium">{song.title}</h3>
                        <p className="text-radio-text-secondary text-sm">
                          {song.duration || '00:00'} • {song.artist}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        className="p-2 text-radio-text-secondary hover:text-radio-light transition-colors"
                        title="Reproduzir música"
                      >
                        <FaPlay />
                      </button>
                      <button 
                        className="p-2 text-radio-text-secondary hover:text-red-400 transition-colors"
                        onClick={() => deleteSong(song.id)}
                        title="Excluir música"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

              {selectedFolder && (!selectedFolder.songs || selectedFolder.songs.length === 0) && (
                <div className="text-center py-8 text-radio-text-secondary">
                  <p>Nenhuma música nesta pasta</p>
                  <p className="text-sm mt-2">Clique em "Importar Músicas" para adicionar</p>
                </div>
              )}

              {!selectedFolder && (
                <div className="text-center py-8 text-radio-text-secondary">
                  <p>Selecione uma pasta para ver suas músicas</p>
                  <p className="text-sm mt-2">Ou crie uma nova pasta usando o botão "Nova Pasta"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Nova Pasta */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-radio-blue rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-bold text-radio-text mb-4">
              {editingFolder ? 'Editar Pasta' : 'Nova Pasta'}
            </h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nome da pasta (ex: Nome do Artista)"
              className="w-full p-3 bg-radio-accent text-radio-text rounded-lg border-none focus:ring-radio-light mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setEditingFolder(null);
                  setNewFolderName('');
                }}
                className="px-4 py-2 text-radio-text-secondary hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editingFolder ? updateFolder : createFolder}
                className="px-4 py-2 bg-radio-light text-white rounded-lg hover:bg-opacity-80 transition-colors"
              >
                {editingFolder ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;