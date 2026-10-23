const slugify = require('./slugify');

// Shapes a Reader model instance (with images/videos/files associations loaded)
// into the JSON returned by the API, computing public URLs from disk paths.
function serializeReader(reader) {
  const r = reader.toJSON ? reader.toJSON() : reader;

  const images = (r.images || [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      id: img.id,
      url: `/uploads/${img.path.replace(/\\/g, '/')}`,
    }));

  const videos = (r.videos || [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((vid) => ({
      id: vid.id,
      name: vid.originalName || null,
      url: `/api/readers/${r.id}/videos/${vid.id}`,
    }));

  const files = (r.files || []).slice().sort((a, b) => a.position - b.position);
  const toFile = (f) => ({
    id: f.id,
    name: f.originalName || null,
    downloadUrl: `/api/readers/${r.id}/files/${f.id}/download`,
  });

  return {
    id: r.id,
    name: r.name,
    slug: slugify(r.name),
    category: r.category,
    shortDescription: r.shortDescription,
    description: r.description,
    features: r.features || [],
    images,
    coverImageUrl: images[0]?.url || null,
    videos,
    sdkFiles: files.filter((f) => f.type === 'sdk').map(toFile),
    demoFiles: files.filter((f) => f.type === 'demo').map(toFile),
    isPublished: r.isPublished,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

module.exports = serializeReader;
