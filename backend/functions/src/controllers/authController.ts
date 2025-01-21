import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { generateToken } from '../utils/jwt.js';


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signinWithEmailAndPassword(email, password);
    const token = generateToken(user.uid);
    res.json({ user: { uid: user.uid, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    await authService.signOutUser();
    res.json({ message: 'User signed out successfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email , name , password } = req.body;
    await authService.sendOtp(email,name,password);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp , name , password } = req.body;
    const user = await authService.verifyOtp(email, otp, name,password);
    const token = generateToken(user.uid);
    res.json({ user: { uid: user.uid, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};