import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho absoluto para o banco de dados
const dbPath = path.join(__dirname, '..', '..', '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

// Sincronizar o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
  })
  .catch(error => {
    console.error('Erro ao sincronizar banco:', error);
  });

export default sequelize;
