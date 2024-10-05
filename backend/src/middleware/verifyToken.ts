import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Middleware for token verification
const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const idToken = req.headers.authorization;
    if (!idToken) {
        res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken as any);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

export default verifyToken;
