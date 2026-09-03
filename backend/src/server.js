const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Plain sync() only creates missing tables - it never touches existing
    // columns/indexes. `alter: true` looks convenient for picking up model
    // changes automatically, but on every nodemon restart Sequelize re-adds
    // a new index for each `unique: true` column instead of reusing the
    // existing one, which previously ran the `admins` table into MySQL's
    // 64-key-per-table limit and crashed the server. Prefer explicit,
    // one-off migration scripts (see src/utils/migrateLegacyMedia.js) for
    // schema changes instead of alter.
    await sequelize.sync();
    console.log('Models synchronized.');

    app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`);
      console.log(`Swagger docs at http://localhost:${env.port}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
