require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('../models');
const env = require('../config/env');

async function seedAdmin() {
  await sequelize.authenticate();
  await sequelize.sync();

  const existing = await Admin.findOne({ where: { username: env.admin.username } });
  if (existing) {
    console.log(`Admin user "${env.admin.username}" already exists. Skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(env.admin.password, 10);
  await Admin.create({ username: env.admin.username, passwordHash });

  console.log(`Created admin user "${env.admin.username}".`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin user:', err);
  process.exit(1);
});
