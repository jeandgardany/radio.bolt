import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Track = sequelize.define('Track', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  folderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Folders',
      key: 'id'
    }
  },
  playCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastPlayed: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default Track;
