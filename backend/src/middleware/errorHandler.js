const multer = require('multer');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  if (err) {
    const status = err.status || 400;
    return res.status(status).json({ message: err.message || 'Something went wrong' });
  }

  next();
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

module.exports = { errorHandler, notFoundHandler };
