// One-time migration: copies the old single photoPath/videoPath/sdkFilePath/demoFilePath
// columns on `readers` into the new reader_images/reader_videos/reader_files tables.
// Safe to re-run - skips a reader's media type if it already has rows there.
require('dotenv').config();
const { sequelize, Reader, ReaderImage, ReaderVideo, ReaderFile } = require('../models');

async function migrate() {
  await sequelize.authenticate();
  // Plain sync (no alter/force) only creates missing tables - it won't touch
  // existing columns on `readers`, so the legacy data stays intact until we've
  // read it below.
  await sequelize.sync();

  const readers = await Reader.findAll({ raw: true });
  let imagesAdded = 0;
  let videosAdded = 0;
  let filesAdded = 0;

  for (const r of readers) {
    if (r.photoPath) {
      const existing = await ReaderImage.count({ where: { readerId: r.id } });
      if (existing === 0) {
        await ReaderImage.create({ readerId: r.id, path: r.photoPath, position: 0 });
        imagesAdded++;
      }
    }

    if (r.videoPath) {
      const existing = await ReaderVideo.count({ where: { readerId: r.id } });
      if (existing === 0) {
        await ReaderVideo.create({
          readerId: r.id,
          path: r.videoPath,
          originalName: r.videoOriginalName || null,
          position: 0,
        });
        videosAdded++;
      }
    }

    if (r.sdkFilePath) {
      const existing = await ReaderFile.count({ where: { readerId: r.id, type: 'sdk' } });
      if (existing === 0) {
        await ReaderFile.create({
          readerId: r.id,
          type: 'sdk',
          path: r.sdkFilePath,
          originalName: r.sdkFileOriginalName || null,
          position: 0,
        });
        filesAdded++;
      }
    }

    if (r.demoFilePath) {
      const existing = await ReaderFile.count({ where: { readerId: r.id, type: 'demo' } });
      if (existing === 0) {
        await ReaderFile.create({
          readerId: r.id,
          type: 'demo',
          path: r.demoFilePath,
          originalName: r.demoFileOriginalName || null,
          position: 1,
        });
        filesAdded++;
      }
    }
  }

  console.log(
    `Migration complete. Readers scanned: ${readers.length}. Images added: ${imagesAdded}. Videos added: ${videosAdded}. Files added: ${filesAdded}.`
  );
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
