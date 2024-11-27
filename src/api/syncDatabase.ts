import { sequelize } from '../../config/database';
import { syncFolder } from './models/Folder';

async function syncDatabase() {
  try {
    // Sincroniza todos os modelos
    await sequelize.sync({ force: true }); // Use force: true apenas em desenvolvimento
    console.log('Banco de dados sincronizado com sucesso');
    
    // Sincroniza o modelo Folder especificamente
    await syncFolder();
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

// Executa a sincronização
syncDatabase();
