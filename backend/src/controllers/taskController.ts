import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const { page = '1', limit = '10' } = req.query;

        // Explicitly cast query parameters
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where: any = { userId };

        if (status) {
            where.status = status;
        }

        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }

        const tasks = await prisma.task.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.task.count({ where });

        res.json({
            tasks,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        next(err);
    }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { title, description, status } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'pending',
                userId,
            },
        });

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

export async function getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const id = req.params.id as string;

        const task = await prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json(task);
    } catch (err) {
        next(err);
    }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const id = req.params.id as string;
        const { title, description, status } = req.body;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, status },
        });

        res.json(updatedTask);
    } catch (err) {
        next(err);
    }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const id = req.params.id as string;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        await prisma.task.delete({ where: { id } });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
}

export async function toggleTaskStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.payload?.userId;
        const id = req.params.id as string;

        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status: newStatus },
        });

        res.json(updatedTask);
    } catch (err) {
        next(err);
    }
}
