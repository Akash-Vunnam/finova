import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import next from 'next';

import chatRouter from './routes/chat';
import explainRouter from './routes/explain';
import verdictRouter from './routes/verdict';
import trendingRouter from './routes/trending';
import portfolioRouter from './routes/portfolio';
import stockRouter from './routes/stock';
import { firebaseStatus, initFirebase } from './services/firebase-admin';

dotenv.config({ path: '.env.local' });
dotenv.config();
initFirebase();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 10000;

app.prepare().then(() => {
  const server = express();

  server.use(cors());
  server.use(express.json());

  // Health check
  server.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
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

  server.listen(port as number, "0.0.0.0", () => {
    console.log("Server starting...");
    console.log("PORT =", process.env.PORT || 10000);
    console.log("NODE_ENV =", process.env.NODE_ENV);
    console.log("Health endpoint ready");
    console.log(`> Ready on http://0.0.0.0:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
