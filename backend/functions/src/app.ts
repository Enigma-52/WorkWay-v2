import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import fetch from './utils/fetcher.js';
import connectRabbitMQ from './config/rabbitmq.js';
import firebaseConfig from './config/firebaseConfig.js';
import { consumeActivity } from './workers/worker.js';  // Import the worker

const { 
    db,
    collection,
    setDoc,
    doc,
    getDocs
} = firebaseConfig;

const app = express();

const corsOptions = {
    origin: '*', // temporarily allow all origins for debugging
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

app.use('/api/jobs', routes.jobRoutes);
app.use('/api/auth', routes.authRoutes);
app.use('/api/applications', routes.applicationRoutes);
app.use('/api/jobAlerts', routes.jobAlertsRoutes);
app.use('/api/resume' , routes.resumeRoutes);
app.use('api/discussion' , routes.discussionRoutes);

// Error handling middleware with proper types
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

let channel: any;

connectRabbitMQ().then(ch => channel = ch);

app.post('/activities', (req, res) => {
  const activity = req.body;
  channel.sendToQueue('activity_queue', Buffer.from(JSON.stringify(activity)));
  res.status(200).send({ message: 'Activity Queued' });
});

app.get('/activities', async (req, res) => {
    try {
      const activityRef = collection(firebaseConfig.db, 'activities');
      const snapshot = await getDocs(activityRef);
      const activities = snapshot.docs.map(doc => doc.data());
      res.status(200).json(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).send('Failed to fetch activities');
    }
  });

  consumeActivity();

app.listen(3005, () => {
    console.log('Server started on port 3005');
});

export default app;