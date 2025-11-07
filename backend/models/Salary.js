import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema(
    {
        department: { type: String, required: true },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true
        },
        basicSalary: {
            type: Number,
            required: true,
            min: [0, 'Basic salary cannot be negative']
        },
        allowances: {
            type: Number,
            default: 0,
            min: [0, 'Allowances cannot be negative']
        },
        deductions: {
            type: Number,
            default: 0,
            min: [0, 'Deductions cannot be negative']
        },
        payDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (v) {
                    return v <= new Date();
                },
                message: 'Pay date cannot be in the future'
            }
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;
