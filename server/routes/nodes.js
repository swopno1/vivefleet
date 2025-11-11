import { Router } from 'express';
import { ping, getNodes } from '../controllers/nodes.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.post('/ping', ping);
router.get('/admin/nodes', authenticateUser, getNodes);

export default router;
