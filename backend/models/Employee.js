import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email'
            ]
        },
        empId: { type: String, required: true, unique: true, trim: true },
        dob: { type: Date, required: true },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other']
        },
        maritalStatus: {
            type: String,
            required: true,
            enum: ['single', 'married', 'divorced', 'widowed']
        },
        department: { type: String, required: true },
        designation: { type: String, required: true },
        salary: {
            type: Number,
            required: true,
            min: [0, 'Salary cannot be negative']
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'employee', 'manager']
        },
        password: { type: String, required: true },
        imageUrl: { type: String, trim: true, default: '' }
    },
    { timestamps: true }
);

// Virtual for salaries
employeeSchema.virtual('salaries', {
    ref: 'Salary',
    localField: '_id',
    foreignField: 'employee'
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
