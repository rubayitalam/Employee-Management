import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'employee'],
            required: true
        },
        profileImage: { type: String },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        },
        leave: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Leave'
        },
        salary: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Salary'
        },

        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
