import { Router } from 'express';
import {matchResume , uploadResume} from '../controllers/resumeController.js'
const router = Router();

router.post('/match/:id', matchResume);
router.post('/upload' , uploadResume);
export default router;