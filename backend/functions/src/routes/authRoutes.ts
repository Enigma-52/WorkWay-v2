import { Router } from 'express';
import {  login, sendOtp, verifyOtp }  from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;