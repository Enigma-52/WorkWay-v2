import { Router } from 'express';
import { listApplications , updateApplication ,addApplication }  from '../controllers/applicationController.js';

const router = Router();

router.get('/', listApplications);
router.get('/add', addApplication);
router.get('/update', updateApplication);

export default router;