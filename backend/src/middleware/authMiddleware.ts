import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
    payload?: { userId: string };
}

export function isAuthenticated(req: AuthRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).json({ error: '🚫 Un-Authorized 🚫' });
        return;
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.payload = payload;
    } catch (err: any) {
        res.status(401).json({ error: '🚫 Un-Authorized 🚫' });
        if (err.name === 'TokenExpiredError') {
            // client should handle this by refreshing
        }
        return;
    }

    return next();
}
