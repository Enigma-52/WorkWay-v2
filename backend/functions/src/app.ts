import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import fetch from './utils/fetcher.js';
import connectRabbitMQ from './config/rabbitmq.js';
import firebaseConfig from './config/firebaseConfig.js';

const { 
    db,
    collection,
    setDoc,
    doc,
    getDocs
} = firebaseConfig;

const app = express();

const corsOptions = {
    origin: [
      'http://localhost:5173',
      'https://work-way-v2.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

app.use(express.json());

// Base routes
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

// API routes
app.use('/api/jobs', routes.jobRoutes);
app.use('/api/auth', routes.authRoutes);
app.use('/api/applications', routes.applicationRoutes);
app.use('/api/jobAlerts', routes.jobAlertsRoutes);
app.use('/api/resume', routes.resumeRoutes);
app.use('/api/discussion', routes.discussionRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(3005, () => {
    console.log('Server is running on port 3005');
})
export default app;