import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import fs from 'fs/promises';
import bodyParser from 'body-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuração do banco
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: true
});

// Definir modelo Folder
const Folder = sequelize.define('Folder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Inicializar banco
async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco estabelecida');
    
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados');
    
    // Criar estrutura inicial de pastas
    const uploadsPath = path.join(process.cwd(), 'uploads');
    const musicPath = path.join(uploadsPath, 'music');
    
    await fs.mkdir(uploadsPath, { recursive: true });
    await fs.mkdir(musicPath, { recursive: true });
    console.log('Estrutura de pastas criada:', { uploadsPath, musicPath });
    
    // Verificar pastas no banco
    const folders = await Folder.findAll();
    console.log('Pastas no banco:', folders.length);
    
    // Recriar pastas físicas
    for (const folder of folders) {
      const fullPath = path.join(musicPath, folder.name);
      await fs.mkdir(fullPath, { recursive: true });
      console.log('Pasta recriada:', fullPath);
    }
  } catch (error) {
    console.error('Erro ao inicializar:', error);
  }
}

// Iniciar banco
initDB();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const url = new URL(req.url, 'http://localhost');
      const folderId = url.pathname.split('/').pop();
      
      const folder = await Folder.findByPk(folderId);
      if (!folder) {
        cb(new Error('Pasta não encontrada'), null);
        return;
      }
      
      const uploadPath = path.join(process.cwd(), 'uploads', 'music', folder.name);
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

async function handleRequest(req, res) {
  console.log('Requisição recebida:', req.method, req.url);
  console.log('Headers:', req.headers);
  
  // Criar pasta
  if (req.url === '/api/folders' && req.method === 'POST') {
    console.log('Tentando criar pasta...');
    try {
      console.log('Body recebido:', req.body);
      const { name } = req.body;
      
      if (!name) {
        throw new Error('Nome da pasta é obrigatório');
      }

      // Criar pasta física dentro de uploads/music
      const folderPath = path.join('uploads', 'music', name);
      const fullPath = path.join(process.cwd(), folderPath);
      
      console.log('Criando pasta em:', fullPath);
      await fs.mkdir(fullPath, { recursive: true });
      
      // Salvar no banco
      const folder = await Folder.create({
        name,
        path: folderPath // Salvamos o caminho relativo
      });
      
      console.log('Pasta criada:', {
        name: folder.name,
        path: folder.path,
        fullPath
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(folder));
      return;
    } catch (error) {
      console.error('Erro ao criar pasta:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }
  }
  
  // Listar pastas
  if (req.url === '/api/folders' && req.method === 'GET') {
    try {
      const folders = await Folder.findAll();
      console.log('Pastas encontradas:', folders.map(f => ({
        name: f.name,
        path: f.path
      })));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(folders));
      return;
    } catch (error) {
      console.error('Erro ao listar pastas:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }
  }
  
  // Excluir pasta
  if (req.url.startsWith('/api/folders/') && req.method === 'DELETE') {
    try {
      const urlParts = req.url.split('/');
      const folderId = urlParts[urlParts.length - 1];
      console.log('URL:', req.url);
      console.log('URL parts:', urlParts);
      console.log('Tentando excluir pasta com ID:', folderId);
      
      if (!folderId || isNaN(Number(folderId))) {
        console.error('ID inválido:', folderId);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ID da pasta inválido' }));
        return;
      }

      const folder = await Folder.findByPk(Number(folderId));
      console.log('Pasta encontrada:', folder);
      
      if (!folder) {
        console.log('Pasta não encontrada');
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Pasta não encontrada' }));
        return;
      }

      // Excluir pasta física e seu conteúdo
      const fullPath = path.join(process.cwd(), folder.path);
      console.log('Excluindo pasta física:', fullPath);
      
      try {
        await fs.rm(fullPath, { recursive: true, force: true });
        console.log('Pasta física excluída com sucesso');
      } catch (fsError) {
        console.error('Erro ao excluir pasta física:', fsError);
        // Continua mesmo se a pasta física não existir
      }
      
      // Excluir do banco
      console.log('Excluindo pasta do banco de dados');
      await folder.destroy();
      console.log('Pasta excluída do banco com sucesso');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pasta excluída com sucesso' }));
      return;
    } catch (error) {
      console.error('Erro ao excluir pasta:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Erro interno ao excluir pasta' }));
      return;
    }
  }
  
  // Upload de músicas
  if (req.url.startsWith('/api/upload/') && req.method === 'POST') {
    upload.array('audio')(req, res, async function(err) {
      if (err) {
        console.error('Erro no upload:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }

      try {
        const files = req.files as Express.Multer.File[];
        console.log('Arquivos recebidos:', files.map(f => f.filename));
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          files: files.map(f => ({
            filename: f.filename,
            path: f.path
          }))
        }));
      } catch (error) {
        console.error('Erro ao processar arquivos:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao processar arquivos' }));
      }
    });
    return;
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(bodyParser.json());

        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api')) {
            console.log('Requisição API recebida:', {
              method: req.method,
              url: req.url,
              headers: req.headers,
              body: req.body
            });
            await handleRequest(req, res);
          } else {
            next();
          }
        });
      }
    }
  ]
});