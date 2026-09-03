const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only photos are served as static files (used directly in <img> tags).
// SDK/demo zips are intentionally NOT statically exposed - they're only
// reachable via /api/readers/:id/download/* so isPublished is enforced.
app.use('/uploads/photos', express.static(path.join(__dirname, '..', 'uploads', 'photos')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
