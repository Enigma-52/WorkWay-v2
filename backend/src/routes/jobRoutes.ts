import express from 'express';
import { getLatestJobsController , totalJobs } from '../controllers/jobsController';

const router = express.Router();

//All Job Routes
router.get('/latest', getLatestJobsController);
router.get('/totalJobs' , totalJobs ) ;

export default router;
