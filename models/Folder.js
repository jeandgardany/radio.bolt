import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Folder = sequelize.define('Folder', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Folder;
