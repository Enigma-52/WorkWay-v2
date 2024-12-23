import { Router } from 'express';
import { RequestHandler } from 'express';
import { getAllJobs } from '../controllers/jobsController.js';
import { getAllTestJobs } from '../controllers/jobsController.js';
const router = Router();

router.get('/all', getAllJobs as RequestHandler);
router.get('/test/all', getAllTestJobs as RequestHandler);


export default router;