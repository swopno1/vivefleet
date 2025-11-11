import { Router } from 'express';
import { getHealth, getVersion } from '../controllers/index.js';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import messageRoutes from './messages.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/messages', messageRoutes);
router.get('/health', getHealth);
router.get('/version', getVersion);

export default router;
