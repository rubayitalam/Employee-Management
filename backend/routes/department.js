import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getAllDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';

// GET /api/department - Get all departments
router.get('/', authMiddleware, getAllDepartments);

// POST /api/department/add - Add new department
router.post('/add', authMiddleware, addDepartment);

// PUT /api/department/:id - Update department
router.put('/:id', authMiddleware, updateDepartment);

// DELETE /api/department/:id - Delete department
router.delete('/:id', authMiddleware, deleteDepartment);

export default router;
