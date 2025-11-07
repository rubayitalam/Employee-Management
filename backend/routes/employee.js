import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getAllEmployees,
    addEmployee,
    deleteEmployee,
    getEmployeeById,
    updateEmployee,
    addSalary,
    getSalaryById,
    getSalaries,
    updateSalary,
    deleteSalary,
    getEmployeeLeaves,
    addEmployeeLeave
} from '../controllers/employeeController.js';

// utils/multer.js

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

const router = express.Router();

// Leave routes for employee
router.get('/leave', authMiddleware, getEmployeeLeaves);
router.post('/leave', authMiddleware, addEmployeeLeave);

// Salary routes first
router.get('/salary', authMiddleware, getSalaries);
router.get('/salary/:id', authMiddleware, getSalaryById);
router.delete('/salary/:id', authMiddleware, deleteSalary);
router.post('/salary/add', authMiddleware, addSalary);
router.put('/salary/:id', authMiddleware, updateSalary);

// Employee routes
router.get('/', authMiddleware, getAllEmployees);
router.post('/add', authMiddleware, upload.single('file'), addEmployee);
router.get('/:id', authMiddleware, getEmployeeById);
router.put('/:id', authMiddleware, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);

export default router;
