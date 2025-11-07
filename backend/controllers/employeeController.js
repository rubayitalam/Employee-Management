import Employee from '../models/Employee.js';
import Salary from '../models/Salary.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Leave from '../models/Leave.js';

import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// Configure multer for temporary file storage
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
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
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

// Get all employees with pagination
export const getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Employee.countDocuments();
        const employees = await Employee.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            employees,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEmployees: total,
            employeesPerPage: limit
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

// Add new employee
export const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            empId,
            dob,
            gender,
            maritalStatus,
            department,
            designation,
            salary,
            role,
            password,
            imageUrl
        } = req.body;

        // let imageUrl = '';

        // Handle image upload if file exists
        if (req.file) {
            try {
                imageUrl = await uploadImage(req.file.path);
                console.log('addImage imageUrl == ', imageUrl);
                // Clean up temporary file
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error uploading image:', error);
                return res
                    .status(500)
                    .json({ message: 'Error uploading image' });
            }
        }

        // Validate required fields
        if (
            !name ||
            !email ||
            !empId ||
            !dob ||
            !gender ||
            !maritalStatus ||
            !department ||
            !designation ||
            !salary ||
            !role ||
            !password
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate gender
        if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid gender value' });
        }

        // Validate marital status
        if (
            !['single', 'married', 'divorced', 'widowed'].includes(
                maritalStatus.toLowerCase()
            )
        ) {
            return res.status(400).json({ message: 'Invalid marital status' });
        }

        // Validate role
        if (!['admin', 'employee', 'manager'].includes(role.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Validate salary
        if (salary < 0) {
            return res
                .status(400)
                .json({ message: 'Salary cannot be negative' });
        }

        // Check for existing employee
        const existing = await Employee.findOne({
            $or: [{ empId: empId.trim() }, { email: email.trim() }]
        });
        if (existing) {
            return res.status(400).json({
                message:
                    existing.empId === empId.trim()
                        ? 'Employee ID already exists'
                        : 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new Employee({
            name,
            email,
            empId,
            dob,
            gender: gender.toLowerCase(),
            maritalStatus: maritalStatus.toLowerCase(),
            department,
            designation,
            salary,
            role: role.toLowerCase(),
            password: hashedPassword,
            imageUrl
        });

        const saved = await newEmployee.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error in addEmployee:', error);
        res.status(500).json({
            message: 'Error adding employee',
            error: error.message
        });
    }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete employee's image from Cloudinary if exists
        if (employee.imageUrl) {
            await deleteImage(employee.imageUrl);
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting employee',
            error: error.message
        });
    }
};

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('getEmployeeById id == ', id);
        const employee = await Employee.findById(id)
            .populate('salaries')
            .lean();
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employee',
            error: error.message
        });
    }
};

// Update employee
export const updateEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            empId,
            dob,
            gender,
            maritalStatus,
            department,
            designation,
            salary,
            role
        } = req.body;

        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        let imageUrl = employee.imageUrl;

        // Handle new image upload if file exists
        if (req.file) {
            try {
                // Delete old image if exists
                if (employee.imageUrl) {
                    await deleteImage(employee.imageUrl);
                }

                // Upload new image
                imageUrl = await uploadImage(req.file.path);
                // Clean up temporary file
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Error handling image:', error);
                return res
                    .status(500)
                    .json({ message: 'Error handling image' });
            }
        }

        // Update employee fields
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: name || employee.name,
                email: email || employee.email,
                empId: empId || employee.empId,
                dob: dob || employee.dob,
                gender: gender ? gender.toLowerCase() : employee.gender,
                maritalStatus: maritalStatus
                    ? maritalStatus.toLowerCase()
                    : employee.maritalStatus,
                department: department || employee.department,
                designation: designation || employee.designation,
                salary: salary || employee.salary,
                role: role ? role.toLowerCase() : employee.role,
                imageUrl
            },
            { new: true }
        );

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating employee',
            error: error.message
        });
    }
};

// Add new salary
export const addSalary = async (req, res) => {
    try {
        const {
            department,
            employee,
            basicSalary,
            allowances,
            deductions,
            payDate,
            status
        } = req.body;

        // Validate required fields
        if (!department || !employee || !basicSalary || !payDate) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        // Validate salary values
        if (basicSalary < 0) {
            return res
                .status(400)
                .json({ message: 'Basic salary cannot be negative' });
        }
        if (allowances && allowances < 0) {
            return res
                .status(400)
                .json({ message: 'Allowances cannot be negative' });
        }
        if (deductions && deductions < 0) {
            return res
                .status(400)
                .json({ message: 'Deductions cannot be negative' });
        }

        // Validate pay date
        const payDateObj = new Date(payDate);
        if (payDateObj > new Date()) {
            return res
                .status(400)
                .json({ message: 'Pay date cannot be in the future' });
        }

        // Validate status if provided
        if (status && !['pending', 'paid'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Check if employee exists
        const employeeExists = await Employee.findById(employee);
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const salary = new Salary({
            department,
            employee,
            basicSalary,
            allowances: allowances || 0,
            deductions: deductions || 0,
            payDate,
            status: status || 'pending'
        });

        await salary.save();
        res.status(201).json(salary);
    } catch (error) {
        res.status(500).json({
            message: 'Error adding salary',
            error: error.message
        });
    }
};

// Get all salaries
export const getSalaries = async (req, res) => {
    try {
        console.log('Fetching salaries...');

        // First check if Salary model is properly imported
        if (!Salary) {
            throw new Error('Salary model is not properly imported');
        }

        // Try to find salaries without populate first
        const salaries = await Salary.find();
        console.log('Basic salaries query successful, count:', salaries.length);

        // Now try to populate
        const populatedSalaries = await Salary.find()
            .populate({
                path: 'employee',
                select: 'name empId department email'
            })
            .sort({ payDate: -1, createdAt: -1 });

        console.log(
            'Populated salaries query successful, count:',
            populatedSalaries.length
        );
        res.status(200).json(populatedSalaries);
    } catch (error) {
        console.error('Error in getSalaries:', error);
        // Send more detailed error information
        res.status(500).json({
            message: 'Error fetching salaries',
            error: error.message,
            stack:
                process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Update salary
export const updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            department,
            employee,
            basicSalary,
            allowances,
            deductions,
            payDate,
            status
        } = req.body;

        const salary = await Salary.findById(id);
        if (!salary) {
            return res.status(404).json({ message: 'Salary not found' });
        }

        // Validate salary values if provided
        if (basicSalary && basicSalary < 0) {
            return res
                .status(400)
                .json({ message: 'Basic salary cannot be negative' });
        }
        if (allowances && allowances < 0) {
            return res
                .status(400)
                .json({ message: 'Allowances cannot be negative' });
        }
        if (deductions && deductions < 0) {
            return res
                .status(400)
                .json({ message: 'Deductions cannot be negative' });
        }

        // Validate pay date if provided
        if (payDate) {
            const payDateObj = new Date(payDate);
            if (payDateObj > new Date()) {
                return res
                    .status(400)
                    .json({ message: 'Pay date cannot be in the future' });
            }
        }

        // Validate status if provided
        if (status && !['pending', 'paid'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update fields
        if (department) salary.department = department;
        if (employee) salary.employee = employee;
        if (basicSalary) salary.basicSalary = basicSalary;
        if (allowances !== undefined) salary.allowances = allowances;
        if (deductions !== undefined) salary.deductions = deductions;
        if (payDate) salary.payDate = payDate;
        if (status) salary.status = status;

        await salary.save();
        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating salary',
            error: error.message
        });
    }
};

// Delete salary
export const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        await Salary.findByIdAndDelete(id);
        res.status(200).json({ message: 'Salary deleted' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting salary',
            error: error.messagepos
        });
    }
};

export const getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await Salary.findById(id).populate('employee');
        if (!salary) {
            return res.status(404).json({ message: 'Salary not found' });
        }
        res.status(200).json(salary);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching salary',
            error: error.message
        });
    }
};

// Get all leaves for the logged-in employee
export const getEmployeeLeaves = async (req, res) => {
    try {
        console.log('Mijan');
        const leaves = await Leave.find({ user: req.user?._id }).sort({
            appliedDate: -1
        });
        console.log('leave == ', leaves);
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching leaves',
            error: error.message
        });
    }
};

// Add a new leave for the logged-in employee
export const addEmployeeLeave = async (req, res) => {
    try {
        const { leaveType, from, to, description } = req.body;
        if (!leaveType || !from || !to || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const leave = new Leave({
            user: req.user._id,
            leaveType,
            from,
            to,
            description,
            appliedDate: new Date(),
            status: 'Pending'
        });
        await leave.save();
        res.status(201).json({ message: 'Leave applied successfully', leave });
    } catch (error) {
        res.status(500).json({
            message: 'Error applying leave',
            error: error.message
        });
    }
};
