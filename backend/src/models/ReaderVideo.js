const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ReaderVideo extends Model {}

ReaderVideo.init(
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
    modelName: 'ReaderVideo',
    tableName: 'reader_videos',
  }
);

module.exports = ReaderVideo;
