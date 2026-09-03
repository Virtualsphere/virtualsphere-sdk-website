const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ReaderFile extends Model {}

ReaderFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    readerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      // 'sdk' or 'demo' - which download section this file is grouped under
      type: DataTypes.ENUM('sdk', 'demo'),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'ReaderFile',
    tableName: 'reader_files',
  }
);

module.exports = ReaderFile;
