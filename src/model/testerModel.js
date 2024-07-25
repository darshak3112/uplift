import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
        default: null,
        required: true
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
        num: ['Male', 'Female', 'Others'],
        required: true,
        default: null
    },
    dob: {
        type: Date,
        required: true,
        default: null
    },
    google_auth_url: String,
    taskHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Task',
        task_flag: {
            enum: ['completed', 'pending', 'rejected'],
        }
    }]
}, { timestamps: true })

const Tester = mongoose.models.testers || mongoose.model("testers", testerSchema);

export default Tester;