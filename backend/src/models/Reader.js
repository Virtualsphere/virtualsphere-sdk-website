const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Reader extends Model {}

Reader.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    category: {
      // Free-text product category, e.g. "Handheld RFID Reader", "Fixed RFID Reader"
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      // Stored as JSON array of strings, e.g. ["Long read range", "IP65 rated"]
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    photoPath: {
      // path on disk relative to backend/uploads, e.g. "photos/169..-name.jpg"
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    videoPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    videoOriginalName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sdkFilePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    sdkFileOriginalName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    demoFilePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    demoFileOriginalName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Reader',
    tableName: 'readers',
  }
);

module.exports = Reader;
