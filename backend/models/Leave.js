import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    description: { type: String },
    appliedDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
