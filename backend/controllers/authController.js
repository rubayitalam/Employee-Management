import User from './../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Leave from './../models/Leave.js';
import Salary from './../models/Salary.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(404)
                .json({ success: false, error: 'Wrong Password' });
        }

        const token = jwt.sign(
            { _id: user?._id, role: user?.role },
            process.env.JWT_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '30d'
            }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('authController.js : Error during login:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Verify user
// @route   POST /api/auth/verify
// @access  Private
export const verify = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);
        console.log('verify user == ', user);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User Not Found' });
        }

        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error('authController.js : Error during verification:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ success: false, message: 'All fields are required.' });
        }

        // Find user (works for both User and Employee)
        let user = await User.findById(userId);
        if (!user) {
            // Try Employee model if not found in User
            const Employee = (await import('../models/Employee.js')).default;
            user = await Employee.findById(userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: 'User not found.' });
            }
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect.'
            });
        }

        // Hash new password and update
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    try {
        // Since JWT tokens are stateless, we just return a success message
        // The client is responsible for removing the token
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('authController.js : Error during logout:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'employee'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('authController.js : Error during registration:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const adminDashboardStats = async (req, res) => {
    try {
        // Get total employees count
        const totalEmployees = await Employee.countDocuments();

        // Get total departments count
        const totalDepartments = await Department.countDocuments();

        // Get total salary statistics
        const salaryStats = await Salary.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalary: { $sum: '$basicSalary' },
                    totalAllowances: { $sum: '$allowances' },
                    totalDeductions: { $sum: '$deductions' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get leave statistics
        const leaveStats = await Leave.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get department-wise employee count
        const departmentStats = await Employee.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format leave statistics
        const leaveStatistics = leaveStats.reduce(
            (acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            },
            {
                Pending: 0,
                Approved: 0,
                Rejected: 0
            }
        );

        // Format response
        const response = {
            success: true,
            data: {
                employees: {
                    total: totalEmployees,
                    byDepartment: departmentStats
                },
                departments: {
                    total: totalDepartments
                },
                salary: {
                    total: salaryStats[0]?.totalSalary || 0,
                    totalAllowances: salaryStats[0]?.totalAllowances || 0,
                    totalDeductions: salaryStats[0]?.totalDeductions || 0,
                    count: salaryStats[0]?.count || 0
                },
                leaves: {
                    total: Object.values(leaveStatistics).reduce(
                        (a, b) => a + b,
                        0
                    ),
                    pending: leaveStatistics.Pending || 0,
                    approved: leaveStatistics.Approved || 0,
                    rejected: leaveStatistics.Rejected || 0
                }
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};
