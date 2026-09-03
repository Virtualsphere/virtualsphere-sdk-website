const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');

const SUBDIR_BY_FIELD = {
  photos: 'photos',
  videos: 'videos',
  sdkFiles: 'sdk',
  demoFiles: 'demo',
};

const ALLOWED_IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_VIDEO_EXT = ['.mp4', '.webm', '.mov', '.m4v'];
const ALLOWED_ARCHIVE_EXT = ['.zip', '.rar'];

for (const subdir of Object.values(SUBDIR_BY_FIELD)) {
  fs.mkdirSync(path.join(UPLOADS_ROOT, subdir), { recursive: true });
}

function sanitizeBaseName(originalName) {
  const base = path.basename(originalName, path.extname(originalName));
  return base.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 60);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const subdir = SUBDIR_BY_FIELD[file.fieldname];
    if (!subdir) return cb(new Error(`Unexpected upload field: ${file.fieldname}`));
    cb(null, path.join(UPLOADS_ROOT, subdir));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `${sanitizeBaseName(file.originalname)}-${uniqueSuffix}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  // Busboy decodes multipart filename headers as latin1 by default, so a UTF-8
  // original filename (e.g. containing Chinese characters) arrives mojibake'd.
  // Re-decoding those bytes as UTF-8 fixes it; this is a no-op for plain ASCII names.
  file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'photos') {
    if (!ALLOWED_IMAGE_EXT.includes(ext)) {
      return cb(new Error('Photos must be image files (jpg, jpeg, png, webp, gif)'));
    }
  } else if (file.fieldname === 'videos') {
    if (!ALLOWED_VIDEO_EXT.includes(ext)) {
      return cb(new Error('Videos must be mp4, webm, mov, or m4v files'));
    }
  } else if (file.fieldname === 'sdkFiles' || file.fieldname === 'demoFiles') {
    if (!ALLOWED_ARCHIVE_EXT.includes(ext)) {
      return cb(new Error(`${file.fieldname} must be .zip or .rar files`));
    }
  } else {
    return cb(new Error(`Unexpected upload field: ${file.fieldname}`));
  }

  cb(null, true);
}

const MAX_FILES_PER_FIELD = 20;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB per file, generous for SDK/demo archives and demo videos
  },
});

// Used on create/update routes: accepts multiple photos, videos, sdkFiles and demoFiles, all optional
const uploadReaderFiles = upload.fields([
  { name: 'photos', maxCount: MAX_FILES_PER_FIELD },
  { name: 'videos', maxCount: MAX_FILES_PER_FIELD },
  { name: 'sdkFiles', maxCount: MAX_FILES_PER_FIELD },
  { name: 'demoFiles', maxCount: MAX_FILES_PER_FIELD },
]);

module.exports = { uploadReaderFiles, UPLOADS_ROOT, SUBDIR_BY_FIELD };
