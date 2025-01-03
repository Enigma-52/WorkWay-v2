import { Router } from 'express';
import {matchResume} from '../controllers/resumeController.js'
const router = Router();

router.post('/match', matchResume);


export default router;