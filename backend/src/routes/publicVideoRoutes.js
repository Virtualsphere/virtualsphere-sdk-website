const express = require('express');
const videoController = require('../controllers/videoController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

/**
 * @openapi
 * /api/videos:
 *   get:
 *     tags: [Public - Videos]
 *     summary: List all published YouTube videos
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Video' }
 */
router.get('/', asyncHandler(videoController.listPublic));

module.exports = router;
