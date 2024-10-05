import express, { Request, Response } from 'express';
import verifyToken from './middleware/verifyToken';
import jobRoutes from './routes/jobRoutes'; // Import the user routes

const app = express();

interface CustomRequest extends Request {
    user: any;
}

app.use(express.json());

//Routes
app.use('/api/jobs', jobRoutes);

app.get('/api/user', verifyToken, (req: Request, res: Response) => {
  const user = (req as CustomRequest).user; 
  res.json({ user });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
