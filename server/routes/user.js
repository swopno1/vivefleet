import { Router } from 'express';
import { getProfile } from '../controllers/user.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticateUser, getProfile);

export default router;
