const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Video extends Model {}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    youtubeUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    youtubeId: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Video',
    tableName: 'videos',
  }
);

module.exports = Video;
