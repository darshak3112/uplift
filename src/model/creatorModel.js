import mongoose from "mongoose";
const Schema = mongoose.Schema;
const creatorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: null,
        required: true
    },
    lastName: {
        type: String,
        default: null,
        required: true
    },
    email: {
        type: String,
        unique: true,
        default: null,
        required: true
    },
    mobileNo: {
        type: String,
        unique: true,
        default: null,
        required: true
    },
    country: {
        type: String,
        default: null,
        required: true
    },
    password: {
        type: String,
        default: null,
        required: true
    },
    gender: {
        type: String,
        default: null,
        enum: ['Male', 'Female', 'Others'],
        required: true
    },
    dob: {
        type: Date,
        default: null,

        required: true
    },
    google_auth_url: String,
    taskHistory: [{
        task: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },
        task_flag: {
            type: String,
            enum: ['Open', 'Closed', 'Pending'],
            required: true
        }
    }]
}, { timestamps: true })

const Creator = mongoose.models.creators || mongoose.model("creators", creatorSchema);

export default Creator;