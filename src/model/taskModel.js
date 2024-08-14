import mongoose from 'mongoose';
import { Web_Task, App_Task, Marketing_Task, Survey_Task, Youtube_Task } from './taskModel';
const Schema = mongoose.Schema;

const Task = new Schema({
    type:{
        type: String,
        required: true
    },
    web:{
        type: Schema.Types.ObjectId,
        ref: 'Web_Task',
    },
    app:{
        type: Schema.Types.ObjectId,
        ref: 'App_Task',
    },
    marketing:{
        type: Schema.Types.ObjectId,
        ref: 'Marketing_Task',
    },
    survey:{
        type: Schema.Types.ObjectId,
        ref: 'Survey_Task',
    },
    youtube:{
        type: Schema.Types.ObjectId,
        ref: 'Youtube',
    },
}, {timestamps: true});

export default mongoose.model('Task', Task);