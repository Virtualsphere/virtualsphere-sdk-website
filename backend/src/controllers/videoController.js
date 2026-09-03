const { Video } = require('../models');
const extractYoutubeId = require('../utils/extractYoutubeId');

function serializeVideo(video) {
  const v = video.toJSON ? video.toJSON() : video;
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    youtubeUrl: v.youtubeUrl,
    youtubeId: v.youtubeId,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    isPublished: v.isPublished,
    position: v.position,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  };
}

// ---------- Public endpoints ----------

async function listPublic(req, res) {
  const videos = await Video.findAll({
    where: { isPublished: true },
    order: [
      ['position', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });
  res.json(videos.map(serializeVideo));
}

// ---------- Admin endpoints ----------

async function listAdmin(req, res) {
  const videos = await Video.findAll({
    order: [
      ['position', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });
  res.json(videos.map(serializeVideo));
}

async function create(req, res) {
  const { title, youtubeUrl, description, isPublished } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'title is required' });
  }

  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) {
    return res.status(400).json({ message: 'A valid YouTube URL is required' });
  }

  const startPosition = (await Video.max('position')) ?? -1;

  const video = await Video.create({
    title: title.trim(),
    youtubeUrl: youtubeUrl.trim(),
    youtubeId,
    description: description || null,
    isPublished: isPublished === undefined ? true : isPublished === 'true' || isPublished === true,
    position: startPosition + 1,
  });

  res.status(201).json(serializeVideo(video));
}

async function update(req, res) {
  const video = await Video.findByPk(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const { title, youtubeUrl, description, isPublished } = req.body;

  if (title !== undefined) {
    if (!title.trim()) return res.status(400).json({ message: 'title is required' });
    video.title = title.trim();
  }

  if (youtubeUrl !== undefined) {
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ message: 'A valid YouTube URL is required' });
    video.youtubeUrl = youtubeUrl.trim();
    video.youtubeId = youtubeId;
  }

  if (description !== undefined) video.description = description || null;
  if (isPublished !== undefined) video.isPublished = isPublished === 'true' || isPublished === true;

  await video.save();
  res.json(serializeVideo(video));
}

async function remove(req, res) {
  const video = await Video.findByPk(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  await video.destroy();
  res.status(204).send();
}

module.exports = {
  listPublic,
  listAdmin,
  create,
  update,
  remove,
};
