const fs = require('fs');
const path = require('path');
const { Reader, ReaderImage, ReaderVideo, ReaderFile } = require('../models');
const parseFeatures = require('../utils/parseFeatures');
const serializeReader = require('../utils/serializeReader');
const slugify = require('../utils/slugify');
const { UPLOADS_ROOT, SUBDIR_BY_FIELD } = require('../middleware/upload');

const MEDIA_INCLUDE = [
  { model: ReaderImage, as: 'images' },
  { model: ReaderVideo, as: 'videos' },
  { model: ReaderFile, as: 'files' },
];

function safeUnlink(relativePath) {
  if (!relativePath) return;
  const fullPath = path.join(UPLOADS_ROOT, relativePath);
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete file ${fullPath}:`, err.message);
    }
  });
}

function relativePathFor(file) {
  const subdir = SUBDIR_BY_FIELD[file.fieldname];
  return `${subdir}/${file.filename}`;
}

// Persists newly uploaded photos/videos/sdkFiles/demoFiles for a reader,
// appending after any existing items (by position).
async function attachUploadedMedia(reader, files) {
  const photos = files.photos || [];
  const videos = files.videos || [];
  const sdkFiles = files.sdkFiles || [];
  const demoFiles = files.demoFiles || [];

  if (photos.length) {
    const startPosition = (await ReaderImage.max('position', { where: { readerId: reader.id } })) ?? -1;
    await ReaderImage.bulkCreate(
      photos.map((file, i) => ({
        readerId: reader.id,
        path: relativePathFor(file),
        position: startPosition + 1 + i,
      }))
    );
  }

  if (videos.length) {
    const startPosition = (await ReaderVideo.max('position', { where: { readerId: reader.id } })) ?? -1;
    await ReaderVideo.bulkCreate(
      videos.map((file, i) => ({
        readerId: reader.id,
        path: relativePathFor(file),
        originalName: file.originalname,
        position: startPosition + 1 + i,
      }))
    );
  }

  if (sdkFiles.length || demoFiles.length) {
    const startPosition = (await ReaderFile.max('position', { where: { readerId: reader.id } })) ?? -1;
    let offset = 0;
    const rows = [];
    for (const file of sdkFiles) {
      rows.push({
        readerId: reader.id,
        type: 'sdk',
        path: relativePathFor(file),
        originalName: file.originalname,
        position: startPosition + 1 + offset++,
      });
    }
    for (const file of demoFiles) {
      rows.push({
        readerId: reader.id,
        type: 'demo',
        path: relativePathFor(file),
        originalName: file.originalname,
        position: startPosition + 1 + offset++,
      });
    }
    await ReaderFile.bulkCreate(rows);
  }
}

// ---------- Public endpoints ----------

async function listPublic(req, res) {
  const readers = await Reader.findAll({
    where: { isPublished: true },
    include: MEDIA_INCLUDE,
    order: [['createdAt', 'DESC']],
  });
  res.json(readers.map(serializeReader));
}

// Accepts either a numeric id (legacy links like /readers/6) or a slug derived
// from the reader's name (e.g. /readers/udt9r-rfid-smart-jewellery-tray-reader).
async function getPublicById(req, res) {
  const param = req.params.id;
  let reader;

  if (/^\d+$/.test(param)) {
    reader = await Reader.findOne({
      where: { id: param, isPublished: true },
      include: MEDIA_INCLUDE,
    });
  } else {
    const wanted = slugify(param);
    const candidates = await Reader.findAll({
      where: { isPublished: true },
      attributes: ['id', 'name'],
      order: [['createdAt', 'ASC']],
    });
    const match = candidates.find((r) => slugify(r.name) === wanted);
    if (match) reader = await Reader.findByPk(match.id, { include: MEDIA_INCLUDE });
  }

  if (!reader) return res.status(404).json({ message: 'Reader not found' });
  res.json(serializeReader(reader));
}

async function streamVideo(req, res) {
  const reader = await Reader.findOne({ where: { id: req.params.id, isPublished: true } });
  if (!reader) return res.status(404).json({ message: 'Reader not found' });

  const video = await ReaderVideo.findOne({ where: { id: req.params.videoId, readerId: reader.id } });
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const fullPath = path.join(UPLOADS_ROOT, video.path);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'File not found on server' });

  // res.sendFile (unlike res.download) doesn't force an attachment download and
  // supports HTTP Range requests out of the box, so the browser can seek/scrub.
  res.sendFile(fullPath);
}

async function downloadFile(req, res) {
  const reader = await Reader.findOne({ where: { id: req.params.id, isPublished: true } });
  if (!reader) return res.status(404).json({ message: 'Reader not found' });

  const file = await ReaderFile.findOne({ where: { id: req.params.fileId, readerId: reader.id } });
  if (!file) return res.status(404).json({ message: 'File not found' });

  const fullPath = path.join(UPLOADS_ROOT, file.path);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'File not found on server' });

  res.download(fullPath, file.originalName || path.basename(fullPath));
}

// ---------- Admin endpoints ----------

async function listAdmin(req, res) {
  const readers = await Reader.findAll({ include: MEDIA_INCLUDE, order: [['createdAt', 'DESC']] });
  res.json(readers.map(serializeReader));
}

async function getAdminById(req, res) {
  const reader = await Reader.findByPk(req.params.id, { include: MEDIA_INCLUDE });
  if (!reader) return res.status(404).json({ message: 'Reader not found' });
  res.json(serializeReader(reader));
}

async function create(req, res) {
  const { name, category, shortDescription, description, isPublished } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'name is required' });
  }

  const reader = await Reader.create({
    name: name.trim(),
    category: category?.trim() || null,
    shortDescription: shortDescription || null,
    description: description || null,
    features: parseFeatures(req.body.features),
    isPublished: isPublished === undefined ? true : isPublished === 'true' || isPublished === true,
  });

  await attachUploadedMedia(reader, req.files || {});

  const withMedia = await Reader.findByPk(reader.id, { include: MEDIA_INCLUDE });
  res.status(201).json(serializeReader(withMedia));
}

async function update(req, res) {
  const reader = await Reader.findByPk(req.params.id);
  if (!reader) return res.status(404).json({ message: 'Reader not found' });

  const { name, category, shortDescription, description, isPublished, features } = req.body;

  if (name !== undefined) reader.name = name.trim();
  if (category !== undefined) reader.category = category.trim() || null;
  if (shortDescription !== undefined) reader.shortDescription = shortDescription || null;
  if (description !== undefined) reader.description = description || null;
  if (features !== undefined) reader.features = parseFeatures(features);
  if (isPublished !== undefined) reader.isPublished = isPublished === 'true' || isPublished === true;

  await reader.save();
  await attachUploadedMedia(reader, req.files || {});

  const withMedia = await Reader.findByPk(reader.id, { include: MEDIA_INCLUDE });
  res.json(serializeReader(withMedia));
}

async function remove(req, res) {
  const reader = await Reader.findByPk(req.params.id, { include: MEDIA_INCLUDE });
  if (!reader) return res.status(404).json({ message: 'Reader not found' });

  for (const img of reader.images) safeUnlink(img.path);
  for (const vid of reader.videos) safeUnlink(vid.path);
  for (const file of reader.files) safeUnlink(file.path);

  await ReaderImage.destroy({ where: { readerId: reader.id } });
  await ReaderVideo.destroy({ where: { readerId: reader.id } });
  await ReaderFile.destroy({ where: { readerId: reader.id } });
  await reader.destroy();

  res.status(204).send();
}

async function removeImage(req, res) {
  const image = await ReaderImage.findOne({ where: { id: req.params.imageId, readerId: req.params.id } });
  if (!image) return res.status(404).json({ message: 'Image not found' });
  safeUnlink(image.path);
  await image.destroy();
  res.status(204).send();
}

async function removeVideo(req, res) {
  const video = await ReaderVideo.findOne({ where: { id: req.params.videoId, readerId: req.params.id } });
  if (!video) return res.status(404).json({ message: 'Video not found' });
  safeUnlink(video.path);
  await video.destroy();
  res.status(204).send();
}

async function removeFile(req, res) {
  const file = await ReaderFile.findOne({ where: { id: req.params.fileId, readerId: req.params.id } });
  if (!file) return res.status(404).json({ message: 'File not found' });
  safeUnlink(file.path);
  await file.destroy();
  res.status(204).send();
}

module.exports = {
  listPublic,
  getPublicById,
  streamVideo,
  downloadFile,
  listAdmin,
  getAdminById,
  create,
  update,
  remove,
  removeImage,
  removeVideo,
  removeFile,
};
