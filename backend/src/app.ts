import express, { Request } from 'express';
import cors from 'cors'; 
import jobRoutes from './routes/jobRoutes';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Health check API
app.get('/health', (req: Request, res) => {
    res.status(200).send({ message: 'All good' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
