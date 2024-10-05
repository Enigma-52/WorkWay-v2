import { Router } from 'express';
import { getAllJobs } from '../controllers/jobsController';

const router = Router();

router.get('/all', getAllJobs);

export default router;