const express = require('express');
const authRoutes = require('./authRoutes');
const publicReaderRoutes = require('./publicReaderRoutes');
const adminReaderRoutes = require('./adminReaderRoutes');
const publicVideoRoutes = require('./publicVideoRoutes');
const adminVideoRoutes = require('./adminVideoRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/readers', publicReaderRoutes);
router.use('/admin/readers', adminReaderRoutes);
router.use('/videos', publicVideoRoutes);
router.use('/admin/videos', adminVideoRoutes);

module.exports = router;
