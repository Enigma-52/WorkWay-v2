import express, { Request } from 'express';
import cors from 'cors'; 
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';


const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

// Health check API
app.get('/health', (req: Request, res) => {
    res.status(200).send({ message: 'All good' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
