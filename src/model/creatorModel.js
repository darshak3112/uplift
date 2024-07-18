import mongoose from "mongoose";
const Schema = mongoose.Schema;
const creatorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobileNo: {
        type: String,
        unique: true,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
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
            enum: ['open', 'closed', 'pending'],
            required: true
        }
    }]
},{timestamps: true})

const Creator = mongoose.models.creators || mongoose.model("creators", creatorSchema);

export default Creator;