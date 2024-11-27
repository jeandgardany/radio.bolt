import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../../../../config/database';

interface FolderModel extends Model<InferAttributes<FolderModel>, InferCreationAttributes<FolderModel>> {
  id: number;
  name: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Folder = sequelize.define<FolderModel>('Folder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Folder',
  timestamps: true
});

export default Folder;
