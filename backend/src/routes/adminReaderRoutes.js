const express = require('express');
const readerController = require('../controllers/readerController');
const { requireAdminAuth } = require('../middleware/auth');
const { uploadReaderFiles } = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAdminAuth);

/**
 * @openapi
 * /api/admin/readers:
 *   get:
 *     tags: [Admin - Readers]
 *     summary: List all readers (including unpublished)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of readers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reader' }
 */
router.get('/', asyncHandler(readerController.listAdmin));

/**
 * @openapi
 * /api/admin/readers/{id}:
 *   get:
 *     tags: [Admin - Readers]
 *     summary: Get a single reader by id (any status)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Reader details
 *       404:
 *         description: Reader not found
 */
router.get('/:id', asyncHandler(readerController.getAdminById));

/**
 * @openapi
 * /api/admin/readers:
 *   post:
 *     tags: [Admin - Readers]
 *     summary: Create a new reader (multipart form; photos/videos/sdkFiles/demoFiles each accept multiple files)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               category: { type: string, description: 'Free-text product category, e.g. Handheld RFID Reader' }
 *               shortDescription: { type: string }
 *               description: { type: string }
 *               features: { type: string, description: 'JSON-stringified array of strings' }
 *               isPublished: { type: boolean }
 *               photos: { type: array, items: { type: string, format: binary } }
 *               videos: { type: array, items: { type: string, format: binary }, description: 'mp4, webm, mov, m4v' }
 *               sdkFiles: { type: array, items: { type: string, format: binary }, description: 'ZIP or RAR files' }
 *               demoFiles: { type: array, items: { type: string, format: binary }, description: 'ZIP or RAR files' }
 *     responses:
 *       201:
 *         description: Reader created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reader' }
 *       400:
 *         description: Validation or upload error
 */
router.post('/', uploadReaderFiles, asyncHandler(readerController.create));

/**
 * @openapi
 * /api/admin/readers/{id}:
 *   put:
 *     tags: [Admin - Readers]
 *     summary: Update a reader's fields and/or append new photos/videos/sdkFiles/demoFiles. To remove an existing media item, use its dedicated delete endpoint instead.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string, description: 'Free-text product category, e.g. Handheld RFID Reader' }
 *               shortDescription: { type: string }
 *               description: { type: string }
 *               features: { type: string, description: 'JSON-stringified array of strings' }
 *               isPublished: { type: boolean }
 *               photos: { type: array, items: { type: string, format: binary } }
 *               videos: { type: array, items: { type: string, format: binary }, description: 'mp4, webm, mov, m4v' }
 *               sdkFiles: { type: array, items: { type: string, format: binary }, description: 'ZIP or RAR files' }
 *               demoFiles: { type: array, items: { type: string, format: binary }, description: 'ZIP or RAR files' }
 *     responses:
 *       200:
 *         description: Reader updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reader' }
 *       404:
 *         description: Reader not found
 */
router.put('/:id', uploadReaderFiles, asyncHandler(readerController.update));

/**
 * @openapi
 * /api/admin/readers/{id}:
 *   delete:
 *     tags: [Admin - Readers]
 *     summary: Delete a reader and all its uploaded media/files
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
 *         description: Reader not found
 */
router.delete('/:id', asyncHandler(readerController.remove));

/**
 * @openapi
 * /api/admin/readers/{id}/images/{imageId}:
 *   delete:
 *     tags: [Admin - Readers]
 *     summary: Delete a single image from a reader
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Image not found
 */
router.delete('/:id/images/:imageId', asyncHandler(readerController.removeImage));

/**
 * @openapi
 * /api/admin/readers/{id}/videos/{videoId}:
 *   delete:
 *     tags: [Admin - Readers]
 *     summary: Delete a single video from a reader
 *     security: [{ bearerAuth: [] }]
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
 *       204:
 *         description: Deleted
 *       404:
 *         description: Video not found
 */
router.delete('/:id/videos/:videoId', asyncHandler(readerController.removeVideo));

/**
 * @openapi
 * /api/admin/readers/{id}/files/{fileId}:
 *   delete:
 *     tags: [Admin - Readers]
 *     summary: Delete a single SDK or demo software file from a reader
 *     security: [{ bearerAuth: [] }]
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
 *       204:
 *         description: Deleted
 *       404:
 *         description: File not found
 */
router.delete('/:id/files/:fileId', asyncHandler(readerController.removeFile));

module.exports = router;
