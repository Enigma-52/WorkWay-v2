import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import fetch from './utils/fetcher.js';

const app = express();

const corsOptions = {
    origin: true, // temporarily allow all origins for debugging
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    credentials: false  // change to false if not using cookies
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes with proper types
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'All good' });
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'All good' });
});

app.get('/cron', async (req: Request, res: Response) => {
    console.log('Cron job started : Load All Jobs');
    await fetch();
    console.log('Cron completed : All Jobs Loaded');
    res.status(200).json({ message: 'Jobs Loaded' });
});

app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware with proper types
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default app;