import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { register, login, verifyPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-password', authenticateToken, verifyPassword);

export default router;

