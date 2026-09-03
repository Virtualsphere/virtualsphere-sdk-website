const express = require('express');
const videoController = require('../controllers/videoController');
const { requireAdminAuth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAdminAuth);

/**
 * @openapi
 * /api/admin/videos:
 *   get:
 *     tags: [Admin - Videos]
 *     summary: List all videos (including unpublished)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Video' }
 */
router.get('/', asyncHandler(videoController.listAdmin));

/**
 * @openapi
 * /api/admin/videos:
 *   post:
 *     tags: [Admin - Videos]
 *     summary: Add a YouTube video by its URL
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, youtubeUrl]
 *             properties:
 *               title: { type: string }
 *               youtubeUrl: { type: string, description: 'Any youtube.com or youtu.be link' }
 *               description: { type: string }
 *               isPublished: { type: boolean }
 *     responses:
 *       201:
 *         description: Video created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Video' }
 *       400:
 *         description: Validation error
 */
router.post('/', asyncHandler(videoController.create));

/**
 * @openapi
 * /api/admin/videos/{id}:
 *   put:
 *     tags: [Admin - Videos]
 *     summary: Update a video's title, URL, description, or published status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               youtubeUrl: { type: string }
 *               description: { type: string }
 *               isPublished: { type: boolean }
 *     responses:
 *       200:
 *         description: Video updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Video' }
 *       404:
 *         description: Video not found
 */
router.put('/:id', asyncHandler(videoController.update));

/**
 * @openapi
 * /api/admin/videos/{id}:
 *   delete:
 *     tags: [Admin - Videos]
 *     summary: Delete a video
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Video not found
 */
router.delete('/:id', asyncHandler(videoController.remove));

module.exports = router;
