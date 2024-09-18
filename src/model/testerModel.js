import mongoose from 'mongoose';

const testerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        default: null
    },
    lastName: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobileNo: {
        type: String,
        unique: true,
        required: true,
        default: null
    },
    pincode: {
        type: Number,
        required: true,
        default: null
    },
    country: {
        type: String,
        required: true,
        default: null
    },
    password: {
        type: String,
        required: true,
        default: null
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        required: true,
        default: null
    },
    dob: {
        type: Date,
        required: true,
        default: null
    },
    google_auth_url: String,
    taskHistory: [
        {
            taskId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task',
                required: true
            },
            status: {
                type: String,
                enum: ['applied', 'pending', 'rejected', 'success'],
            }
        }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

const Tester = mongoose.models.Tester || mongoose.model('Tester', testerSchema);
export default Tester;
