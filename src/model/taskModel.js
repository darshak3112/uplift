import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    web: {
        type: Schema.Types.ObjectId,
        ref: 'Web_Task',
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'App_Task',
    },
    marketing: {
        type: Schema.Types.ObjectId,
        ref: 'Marketing_Task',
    },
    survey: {
        type: Schema.Types.ObjectId,
        ref: 'Survey_Task',
    },
    youtube: {
        type: Schema.Types.ObjectId,
        ref: 'Youtube',
    },
    task_flag: {
        type: String,
        enum: ['Open', 'Closed', 'Pending'],
        required: true
    }
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
