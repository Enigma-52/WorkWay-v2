import { Router , RequestHandler } from 'express';
import { listApplications , updateApplication ,addApplication }  from '../controllers/applicationController.js';

const router = Router();

router.get('/user/:userId', listApplications);
router.post('/add', addApplication);
router.get('/update/:id', updateApplication);

export default router;