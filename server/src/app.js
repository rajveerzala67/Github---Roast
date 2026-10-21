import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import analyzeRoutes from './routes/analyzeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config/env.js';

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in dev/preview while restricting headers
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser with strict size limit to prevent payload attacks
app.use(express.json({ limit: '30kb' }));

// Mount API routes (supports both /api/analyze and /analyze)
app.use('/api', analyzeRoutes);
app.use('/', analyzeRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found in this galaxy.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
