import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface Jingle {
  id: number;
  name: string;
  duration: string;
  file: string;
}

const JingleManager = () => {
  const [jingles, setJingles] = useState<Jingle[]>([]);
  const dispatch = useDispatch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      setJingles(prev => [
        ...prev,
        {
          id: slotId,
          name: file.name,
          duration: '00:00',
          file: data.file.filename
        }
      ]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gerenciador de Vinhetas</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => {
          const jingle = jingles.find(j => j.id === index);
          
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">
                <h3 className="font-semibold mb-4">Slot {index + 1}</h3>
                
                {jingle ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">{jingle.name}</p>
                    <p className="text-xs text-gray-500">{jingle.duration}</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Reproduzir
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500">
                      <p className="text-sm text-gray-500">Clique para adicionar vinheta</p>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, index)}
                      />
                    </div>
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JingleManager;