const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ReaderImage extends Model {}

ReaderImage.init(
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
      // path on disk relative to backend/uploads, e.g. "photos/169..-name.jpg"
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    position: {
      // Display order within the reader's image carousel (ascending)
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'ReaderImage',
    tableName: 'reader_images',
  }
);

module.exports = ReaderImage;
