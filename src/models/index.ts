import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('gospel_radio', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

export const Music = sequelize.define('Music', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export const Jingle = sequelize.define('Jingle', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export const Program = sequelize.define('Program', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('music', 'live', 'replay'),
    allowNull: false
  }
});

export const synchronizeDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};