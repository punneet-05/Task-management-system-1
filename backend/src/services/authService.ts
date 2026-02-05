import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { hashToken } from '../utils/jwt';

const prisma = new PrismaClient();

// Add refresh token to whitelist
export function addRefreshTokenToWhitelist({ jti, refreshToken, userId }: { jti: string; refreshToken: string; userId: string }) {
    return prisma.refreshToken.create({
        data: {
            id: jti,
            token: hashToken(refreshToken),
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });
}

// Find token by id (jti)
export function findRefreshTokenById(id: string) {
    return prisma.refreshToken.findUnique({
        where: { id },
    });
}

// Delete refresh token
export function deleteRefreshToken(id: string) {
    return prisma.refreshToken.update({
        where: { id },
        data: { revoked: true },
    });
}

export function revokeTokensForUser(userId: string) {
    return prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true },
    });
}

export function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export function createUserByEmailAndPassword(user: any) {
    user.password = bcrypt.hashSync(user.password, 12);
    return prisma.user.create({
        data: user,
    });
}

export function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}
