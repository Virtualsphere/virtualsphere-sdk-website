const express = require('express');
const readerController = require('../controllers/readerController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

/**
 * @openapi
 * /api/readers:
 *   get:
 *     tags: [Public - Readers]
 *     summary: List all published RFID readers
 *     responses:
 *       200:
 *         description: List of readers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reader' }
 */
router.get('/', asyncHandler(readerController.listPublic));

/**
 * @openapi
 * /api/readers/{id}:
 *   get:
 *     tags: [Public - Readers]
 *     summary: Get a single published reader by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Reader details
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reader' }
 *       404:
 *         description: Reader not found
 */
router.get('/:id', asyncHandler(readerController.getPublicById));

/**
 * @openapi
 * /api/readers/{id}/videos/{videoId}:
 *   get:
 *     tags: [Public - Readers]
 *     summary: Stream one of the reader's videos (inline, supports HTTP Range for seeking)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Video file stream
 *         content:
 *           video/mp4: {}
 *       404:
 *         description: Reader or video not found
 */
router.get('/:id/videos/:videoId', asyncHandler(readerController.streamVideo));

/**
 * @openapi
 * /api/readers/{id}/files/{fileId}/download:
 *   get:
 *     tags: [Public - Readers]
 *     summary: Download one of the reader's SDK or demo software archives (.zip or .rar)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Archive file stream
 *         content:
 *           application/zip: {}
 *           application/x-rar-compressed: {}
 *       404:
 *         description: Reader or file not found
 */
router.get('/:id/files/:fileId/download', asyncHandler(readerController.downloadFile));

module.exports = router;
