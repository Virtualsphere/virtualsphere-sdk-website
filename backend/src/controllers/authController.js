const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const env = require('../config/env');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const admin = await Admin.findOne({ where: { username } });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isValid = await admin.comparePassword(password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  res.json({
    token,
    admin: { id: admin.id, username: admin.username },
  });
}

async function me(req, res) {
  res.json({ admin: req.admin });
}

module.exports = { login, me };
