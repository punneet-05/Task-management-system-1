import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export function generateAccessToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string, jti: string) {
    return jwt.sign({ userId, jti }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
