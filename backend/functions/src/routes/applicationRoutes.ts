import { Router } from 'express';
import { listApplications }  from '../controllers/applicationController.js';

const router = Router();

router.get('/', listApplications);

export default router;