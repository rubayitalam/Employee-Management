import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Department name is required'],
            trim: true,
            unique: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

// Add index for faster queries
// departmentSchema.index({ name: 1 });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
