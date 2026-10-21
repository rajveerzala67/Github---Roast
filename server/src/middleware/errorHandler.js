import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred in the galaxy.';

  if (statusCode >= 500) {
    logger.error(`Server Error: ${message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    });
  } else {
    logger.warn(`Client/Upstream Error [${statusCode}]: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(config.env === 'development' && statusCode >= 500 ? { stack: err.stack } : {})
  });
}
