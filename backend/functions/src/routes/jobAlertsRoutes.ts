import { Router } from 'express';
import { 
    listJobAlerts,
    updateJobAlert,
    addJobAlert,
    dailyJobAlert,
    weeklyJobAlert,
    monthlyJobAlert,
    deleteJobAlert  // Add this if you have it
} from '../controllers/jobAlertsController.js';
import { RequestHandler } from 'express';

const router = Router();

router.get('/user/:userId', listJobAlerts as RequestHandler);
router.post('/add', addJobAlert as RequestHandler);
router.put('/update/:id', updateJobAlert );
router.delete('/delete/:id', deleteJobAlert as RequestHandler);  
router.get('/execute/daily', dailyJobAlert);
router.get('/execute/weekly', weeklyJobAlert);
router.get('/execute/monthly', monthlyJobAlert);

export default router;