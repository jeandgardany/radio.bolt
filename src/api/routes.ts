import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import { Request as ExpressRequest, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { sequelize } from '../../../config/database';
import Folder from './models/Folder';

// Estendendo a interface Request do Express
interface CustomRequest extends ExpressRequest {
  body: {
    name?: string;
    [key: string]: any;
  };
  params: ParamsDictionary & {
    folderId?: string;
  };
}

// Configuração do multer para upload
const storage = multer.diskStorage({
  destination: async function (req: CustomRequest, file: Express.Multer.File, cb: Function) {
    try {
      const folderId = req.params.folderId;
      console.log('FolderId recebido:', folderId);

      if (!folderId) {
        console.error('FolderId não fornecido');
        cb(new Error('FolderId não fornecido'), '');
        return;
      }

      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        console.error('Pasta não encontrada para o ID:', folderId);
        cb(new Error('Pasta não encontrada'), '');
        return;
      }

      const folderData = folder.get();
      const uploadPath = path.join(process.cwd(), 'uploads', 'music', folderData.name);
      console.log('Caminho de upload:', uploadPath);

      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      console.error('Erro no destination:', error);
      cb(error, '');
    }
  },
  filename: function (req: CustomRequest, file: Express.Multer.File, cb: Function) {
    console.log('Arquivo recebido:', file.originalname);
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage: storage });

// Rotas da API
export async function handleRequest(req: CustomRequest, res: Response) {
  console.log('Requisição recebida:', req.method, req.url);
  console.log('Headers:', req.headers);

  try {
    // Listar músicas de uma pasta
    if (req.url.match(/^\/api\/folders\/\d+\/songs$/) && req.method === 'GET') {
      const folderId = req.url.split('/')[3];
      console.log('Buscando músicas da pasta:', folderId);

      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Pasta não encontrada' }));
        return;
      }

      const folderData = folder.get();
      const folderPath = path.join(process.cwd(), 'uploads', 'music', folderData.name);
      
      try {
        const files = await fs.readdir(folderPath);
        console.log('Arquivos encontrados:', files);
        
        const songs = files
          .filter(file => file.endsWith('.mp3'))
          .map((file, index) => ({
            id: Date.now() + index,
            title: file.replace('.mp3', ''),
            artist: folderData.name,
            duration: '00:00',
            file
          }));

        console.log('Músicas processadas:', songs);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(songs));
      } catch (error) {
        console.error('Erro ao ler músicas:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao ler músicas' }));
      }
      return;
    }

    // Criar pasta
    if (req.url === '/api/folders' && req.method === 'POST') {
      const { name } = req.body;
      
      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Nome da pasta é obrigatório' }));
        return;
      }

      // Verificar se já existe uma pasta com esse nome
      const existingFolder = await Folder.findOne({ where: { name } });
      if (existingFolder) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Já existe uma pasta com esse nome' }));
        return;
      }

      const folderPath = path.join('uploads', 'music', name);
      const fullPath = path.join(process.cwd(), folderPath);
      
      // Criar pasta física
      await fs.mkdir(fullPath, { recursive: true });
      
      // Criar registro no banco
      const folder = await Folder.create({
        name,
        path: folderPath
      });

      const folderData = folder.get();
      console.log('Pasta criada com sucesso:', folderData);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(folderData));
      return;
    }

    // Listar pastas
    if (req.url === '/api/folders' && req.method === 'GET') {
      const folders = await Folder.findAll({
        order: [['createdAt', 'ASC']]
      });
      
      const foldersData = await Promise.all(folders.map(async folder => {
        const data = folder.get();
        const folderPath = path.join(process.cwd(), 'uploads', 'music', data.name);
        let songs = [];
        
        try {
          const files = await fs.readdir(folderPath);
          songs = files.filter(file => file.endsWith('.mp3'));
        } catch (error) {
          console.error('Erro ao ler pasta:', error);
        }

        return {
          id: data.id,
          name: data.name,
          path: data.path,
          songs,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      }));

      console.log('Pastas encontradas:', foldersData.map(f => ({ name: f.name, path: f.path })));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(foldersData));
      return;
    }

    // Atualizar pasta
    if (req.url.match(/^\/api\/folders\/\d+$/) && req.method === 'PUT') {
      const folderId = req.url.split('/')[3];
      const { name } = req.body;
      
      console.log('Atualizando pasta:', { id: folderId, name });

      if (!name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Nome da pasta é obrigatório' }));
        return;
      }

      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Pasta não encontrada' }));
        return;
      }

      const oldPath = path.join(process.cwd(), 'uploads', 'music', folder.get('name'));
      const newPath = path.join(process.cwd(), 'uploads', 'music', name);

      try {
        // Renomeia a pasta física
        await fs.rename(oldPath, newPath);
        console.log('Pasta física renomeada:', { oldPath, newPath });
        
        // Atualiza no banco
        const updatedFolder = await folder.update({
          name,
          path: path.join('uploads', 'music', name)
        });

        console.log('Pasta atualizada no banco:', updatedFolder.get());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedFolder.get()));
      } catch (error) {
        console.error('Erro ao atualizar pasta:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao atualizar pasta' }));
      }
      return;
    }

    // Excluir pasta
    if (req.url.match(/^\/api\/folders\/\d+$/) && req.method === 'DELETE') {
      const folderId = Number(req.url.split('/')[3]);
      console.log('Tentando excluir pasta com ID:', folderId);

      if (!folderId || isNaN(folderId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ID da pasta inválido' }));
        return;
      }

      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Pasta não encontrada' }));
        return;
      }

      console.log('Pasta encontrada:', folder.get());
      const folderData = folder.get();
      const fullPath = path.join(process.cwd(), 'uploads', 'music', folderData.name);

      try {
        await fs.rm(fullPath, { recursive: true, force: true });
        console.log('Pasta física excluída:', fullPath);
      } catch (error) {
        console.error('Erro ao excluir pasta física:', error);
      }

      await folder.destroy();
      console.log('Pasta excluída do banco com sucesso');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pasta excluída com sucesso', id: folderId }));
      return;
    }

    // Rota não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));

  } catch (error) {
    console.error('Erro na operação:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
}