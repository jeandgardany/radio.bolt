import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import Folder from './models/Folder';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configuração do multer
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const folderId = req.params.folderId;
      if (!folderId) {
        cb(new Error('FolderId não fornecido'), '');
        return;
      }

      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        cb(new Error('Pasta não encontrada'), '');
        return;
      }

      const uploadPath = path.join(process.cwd(), 'uploads', 'music', folder.name);
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, '');
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Rotas
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await Folder.findAll({
      order: [['createdAt', 'ASC']]
    });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pastas' });
  }
});

app.post('/api/folders', async (req, res) => {
  try {
    const folder = await Folder.create(req.body);
    const uploadPath = path.join(process.cwd(), 'uploads', 'music', req.body.name);
    await fs.mkdir(uploadPath, { recursive: true });
    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pasta' });
  }
});

app.get('/api/folders/:id/songs', async (req, res) => {
  try {
    const folder = await Folder.findByPk(req.params.id);
    if (!folder) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    const folderPath = path.join(process.cwd(), 'uploads', 'music', folder.name);
    const files = await fs.readdir(folderPath);
    const songs = files
      .filter(file => file.endsWith('.mp3'))
      .map((file, index) => ({
        id: index + 1,
        title: file.replace('.mp3', ''),
        artist: folder.name,
        duration: '00:00',
        file
      }));

    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar músicas' });
  }
});

app.post('/api/upload/:folderId', upload.array('audio'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    res.json({ 
      message: 'Upload realizado com sucesso',
      files: files.map(file => ({ filename: file.filename }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no upload' });
  }
});

app.delete('/api/folders/:id', async (req, res) => {
  try {
    const folder = await Folder.findByPk(req.params.id);
    if (!folder) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    const folderPath = path.join(process.cwd(), 'uploads', 'music', folder.name);
    await fs.rm(folderPath, { recursive: true, force: true });
    await folder.destroy();

    res.json({ message: 'Pasta excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir pasta' });
  }
});

app.delete('/api/songs/:id', async (req, res) => {
  try {
    const songId = req.params.id;
    // Implemente a lógica de exclusão do arquivo aqui
    res.json({ message: 'Música excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir música' });
  }
});

// Iniciar servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});