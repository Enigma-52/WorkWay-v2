import { Router } from 'express';
import {  receiveActivity,sendActivity }  from '../controllers/rabbitmqController.js';

const router = Router();

router.post('/activity', receiveActivity);
router.get('/activity', sendActivity);

export default router;