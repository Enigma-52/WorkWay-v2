import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import firebaseConfig from '../config/firebaseConfig';

const { auth } = firebaseConfig;

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

    const user =auth.currentUser;
    if (user) {
    (req as any).user = user;
    next();
    } else {
    res.status(401).json({ message: 'Not authorized, no user' });
    }
};