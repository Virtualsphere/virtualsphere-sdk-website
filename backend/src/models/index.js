const sequelize = require('../config/database');
const Reader = require('./Reader');
const Admin = require('./Admin');
const ReaderImage = require('./ReaderImage');
const ReaderVideo = require('./ReaderVideo');
const ReaderFile = require('./ReaderFile');
const Video = require('./Video');

Reader.hasMany(ReaderImage, { as: 'images', foreignKey: 'readerId', onDelete: 'CASCADE' });
ReaderImage.belongsTo(Reader, { foreignKey: 'readerId' });

Reader.hasMany(ReaderVideo, { as: 'videos', foreignKey: 'readerId', onDelete: 'CASCADE' });
ReaderVideo.belongsTo(Reader, { foreignKey: 'readerId' });

Reader.hasMany(ReaderFile, { as: 'files', foreignKey: 'readerId', onDelete: 'CASCADE' });
ReaderFile.belongsTo(Reader, { foreignKey: 'readerId' });

module.exports = {
  sequelize,
  Reader,
  Admin,
  ReaderImage,
  ReaderVideo,
  ReaderFile,
  Video,
};
