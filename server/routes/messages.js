import express from 'express';
import { getMessageHistory } from '../controllers/messages.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/history/:userId', authenticateUser, getMessageHistory);

export default router;
