import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import next from 'next';

import chatRouter from './server/routes/chat';
import explainRouter from './server/routes/explain';
import verdictRouter from './server/routes/verdict';
import trendingRouter from './server/routes/trending';
import portfolioRouter from './server/routes/portfolio';
import stockRouter from './server/routes/stock';
import { firebaseStatus } from './server/services/firebase-admin';

dotenv.config({ path: '.env.local' });
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 10000;

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(express.json());

  // Health check
  server.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok',
      firebase: firebaseStatus,
      timestamp: new Date().toISOString()
    });
  });

  // API Routes
  server.use('/api/ai/chat', chatRouter);
  server.use('/api/ai/explain', explainRouter);
  server.use('/api/ai/verdict', verdictRouter);
  server.use('/api/market/trending', trendingRouter);
  server.use('/api/portfolio', portfolioRouter);
  server.use('/api/stock', stockRouter);

  // Next.js Catch-all
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
