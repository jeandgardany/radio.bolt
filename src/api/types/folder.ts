import { Model } from 'sequelize';

export interface FolderAttributes {
  id: number;
  name: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderInput {
  name: string;
  path: string;
}

export interface FolderInstance extends Model<FolderAttributes, FolderInput>, FolderAttributes {}

export interface RequestWithBody extends Request {
  body: {
    name?: string;
    [key: string]: any;
  };
}
