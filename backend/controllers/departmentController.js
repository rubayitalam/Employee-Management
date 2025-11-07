import Department from '../models/Department.js';

// Get all departments with pagination
export const getAllDepartments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await Department.countDocuments();

        // Get departments with pagination
        const departments = await Department.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            departments,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDepartments: total,
            departmentsPerPage: limit
        });
    } catch (error) {
        console.error('Error in getAllDepartments:', error);
        res.status(500).json({
            message: 'Error fetching departments',
            error: error.message
        });
    }
};

// Add new department
export const addDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate input
        if (!name || name.trim() === '') {
            return res
                .status(400)
                .json({ message: 'Department name is required' });
        }

        // Check if department already exists
        const existingDepartment = await Department.findOne({
            name: name.trim()
        });
        if (existingDepartment) {
            return res
                .status(400)
                .json({ message: 'Department with this name already exists' });
        }

        // Create new department
        const newDepartment = new Department({
            name: name.trim(),
            description: description ? description.trim() : ''
        });

        const savedDepartment = await newDepartment.save();
        res.status(201).json(savedDepartment);
    } catch (error) {
        console.error('Error in addDepartment:', error);
        res.status(500).json({
            message: 'Error adding department',
            error: error.message
        });
    }
};

// Update department
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        console.log('updateDepartment id == ', id);
        console.log('updateDepartment name ==', name);

        // Validate input
        if (!name || name.trim() === '') {
            return res
                .status(400)
                .json({ message: 'Department name is required' });
        }

        // Check if department exists
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Check if new name already exists (excluding current department)
        const existingDepartment = await Department.findOne({
            name: name.trim(),
            _id: { $ne: id }
        });
        if (existingDepartment) {
            return res
                .status(400)
                .json({ message: 'Department with this name already exists' });
        }

        // Update department
        department.name = name.trim();
        const updatedDepartment = await department.save();
        res.status(200).json(updatedDepartment);
    } catch (error) {
        console.error('Error in updateDepartment:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(500).json({
            message: 'Error updating department',
            error: error.message
        });
    }
};

// Delete department
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if department exists
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Delete department
        await Department.findByIdAndDelete(id);
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error in deleteDepartment:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(500).json({
            message: 'Error deleting department',
            error: error.message
        });
    }
};
