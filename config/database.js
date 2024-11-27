const { Sequelize } = require('sequelize');
const path = require('path');
const { fileURLToPath } = require('url');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log,
  define: {
    timestamps: true,
    freezeTableName: true
  }
});

// Sincroniza o banco de dados
async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // Recria as tabelas
    console.log('Banco de dados sincronizado com sucesso');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  }
}

// Executa a sincronização
syncDatabase();

module.exports = { sequelize };
