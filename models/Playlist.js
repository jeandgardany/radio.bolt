import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tracks: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tracks');
      return JSON.parse(rawValue);
    },
    set(value) {
      this.setDataValue('tracks', JSON.stringify(value));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Playlist;
