import { Router } from 'express';
import { signup, login, sendOtp, verifyOtp }  from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;