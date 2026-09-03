const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RFID Reader Catalog API',
      version: '1.0.0',
      description:
        'API for managing RFID reader catalog entries (name, photo, features, SDK & demo software downloads). ' +
        'Public endpoints are open for browsing/downloading; management endpoints require an admin JWT.',
    },
    servers: [
      {
        url: env.apiBaseUrl,
        description: 'Current server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Reader: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'RX-2000 UHF Reader' },
            category: { type: 'string', example: 'Fixed RFID Reader' },
            shortDescription: { type: 'string', example: 'Compact fixed UHF RFID reader for retail and logistics.' },
            description: { type: 'string', example: 'Full details about the reader...' },
            features: {
              type: 'array',
              items: { type: 'string' },
              example: ['Long read range up to 12m', 'IP65 rated', 'PoE support'],
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: { id: { type: 'integer' }, url: { type: 'string' } },
              },
              example: [{ id: 1, url: '/uploads/photos/1699999999-photo.jpg' }],
            },
            coverImageUrl: { type: 'string', example: '/uploads/photos/1699999999-photo.jpg' },
            videos: {
              type: 'array',
              items: {
                type: 'object',
                properties: { id: { type: 'integer' }, name: { type: 'string' }, url: { type: 'string' } },
              },
              example: [{ id: 1, name: 'demo.mp4', url: '/api/readers/1/videos/1' }],
            },
            sdkFiles: {
              type: 'array',
              items: {
                type: 'object',
                properties: { id: { type: 'integer' }, name: { type: 'string' }, downloadUrl: { type: 'string' } },
              },
              example: [{ id: 1, name: 'rx2000-sdk-v1.2.zip', downloadUrl: '/api/readers/1/files/1/download' }],
            },
            demoFiles: {
              type: 'array',
              items: {
                type: 'object',
                properties: { id: { type: 'integer' }, name: { type: 'string' }, downloadUrl: { type: 'string' } },
              },
              example: [{ id: 2, name: 'rx2000-demo-v1.2.zip', downloadUrl: '/api/readers/1/files/2/download' }],
            },
            isPublished: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Video: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'RX-2000 Unboxing & Setup' },
            description: { type: 'string', example: 'A quick walkthrough of the RX-2000 out of the box.' },
            youtubeUrl: { type: 'string', example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            youtubeId: { type: 'string', example: 'dQw4w9WgXcQ' },
            thumbnailUrl: { type: 'string', example: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
            embedUrl: { type: 'string', example: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            isPublished: { type: 'boolean', example: true },
            position: { type: 'integer', example: 0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
