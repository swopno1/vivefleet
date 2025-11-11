import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import messageRoutes from './messages.js';
import healthRoutes from './health.js';
import nodeRoutes from './nodes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/messages', messageRoutes);
router.use(healthRoutes);
router.use('/nodes', nodeRoutes);

export default router;
