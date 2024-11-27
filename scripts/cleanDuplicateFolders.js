import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

async function cleanDuplicateFolders() {
  try {
    // Encontrar todas as pastas duplicadas
    const duplicates = await sequelize.query(`
      SELECT name, COUNT(*) as count
      FROM Folders
      GROUP BY name
      HAVING COUNT(*) > 1
    `, {
      type: QueryTypes.SELECT
    });

    console.log('Pastas duplicadas encontradas:', duplicates);

    // Para cada nome duplicado, manter apenas o registro mais antigo
    for (const duplicate of duplicates) {
      const folders = await sequelize.query(`
        SELECT id, name, path, createdAt
        FROM Folders
        WHERE name = :name
        ORDER BY createdAt ASC
      `, {
        replacements: { name: duplicate.name },
        type: QueryTypes.SELECT
      });

      // Manter o primeiro registro (mais antigo) e deletar os outros
      const [keep, ...remove] = folders;
      const removeIds = remove.map(f => f.id);

      if (removeIds.length > 0) {
        await sequelize.query(`
          DELETE FROM Folders
          WHERE id IN (:ids)
        `, {
          replacements: { ids: removeIds },
          type: QueryTypes.DELETE
        });

        console.log(`Removidas ${removeIds.length} duplicatas da pasta "${duplicate.name}"`);
      }
    }

    console.log('Limpeza concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar pastas duplicadas:', error);
  } finally {
    await sequelize.close();
  }
}

cleanDuplicateFolders();
