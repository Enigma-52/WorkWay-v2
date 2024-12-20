import { Router } from 'express';
import { RequestHandler } from 'express';
import { getAllJobs } from '../controllers/jobsController';

const router = Router();

router.get('/all', getAllJobs as RequestHandler);

export default router;