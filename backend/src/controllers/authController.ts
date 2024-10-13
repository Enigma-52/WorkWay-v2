import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { generateToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.signUpWithEmailAndPassword(email, password, name);
    const token = generateToken(user.uid);
    res.status(201).json({ user: { uid: user.uid, email: user.email, name }, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

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
    const { email } = req.body;
    await authService.sendOtp(email);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await authService.verifyOtp(email, otp);
    const token = generateToken(user.uid);
    res.json({ user: { uid: user.uid, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};