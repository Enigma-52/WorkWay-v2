import { Router } from 'express';
import { listJobAlerts }  from '../controllers/jobAlertsController.js';

const router = Router();

router.get('/', listJobAlerts);

export default router;