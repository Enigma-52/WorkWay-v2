import { Router } from 'express';
import { listJobAlerts ,updateJobAlert ,addJobAlert ,dailyJobAlert , weeklyJobAlert , monthlyJobAlert }  from '../controllers/jobAlertsController.js';

const router = Router();

router.get('/user/:userId', listJobAlerts);
router.get('/add', addJobAlert);
router.get('/update/:id', updateJobAlert);
router.get('/execute/daily', dailyJobAlert);
router.get('/execute/weekly', weeklyJobAlert);
router.get('/execute/monthly', monthlyJobAlert);

export default router;