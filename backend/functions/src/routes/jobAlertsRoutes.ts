import { Router } from 'express';
import { listJobAlerts ,updateJobAlert ,addJobAlert }  from '../controllers/jobAlertsController.js';

const router = Router();

router.get('/', listJobAlerts);
router.get('/add', addJobAlert);
router.get('/update', updateJobAlert);

export default router;