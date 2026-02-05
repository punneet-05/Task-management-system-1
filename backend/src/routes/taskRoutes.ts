import express from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus,
} from '../controllers/taskController';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);

export default router;
