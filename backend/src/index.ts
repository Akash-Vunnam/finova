import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat';
import explainRouter from './routes/explain';
import verdictRouter from './routes/verdict';
import trendingRouter from './routes/trending';
import portfolioRouter from './routes/portfolio';
import stockRouter from './routes/stock';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api/ai/chat', chatRouter);
app.use('/api/ai/explain', explainRouter);
app.use('/api/ai/verdict', verdictRouter);
app.use('/api/market/trending', trendingRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/stock', stockRouter);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
