import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

import {
    login,
    register,
    verify,
    changePassword,
    logout,
    adminDashboardStats
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/verify', authMiddleware, verify);
router.post('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);
router.get('/admin/dashboard', authMiddleware, adminDashboardStats);

export default router;
