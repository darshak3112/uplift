import mongoose, { trusted } from "mongoose";

const Schema = mongoose.Schema;

const ticketModel = new Schema ({
    testerId : {
        type : Schema.Types.ObjectId,
        ref : 'Tester'
    },
    creatorId : {
        type : Schema.Types.ObjectId,
        ref : 'Creator'
    },
    taskId : {
        type : Schema.Types.ObjectId,
        ref : 'Task'
    },
    description : {
        type : String,
        required : true
    },
    screenshot : {
        type : String,
        required : true
    }
})

const Transection = mongoose.models.transections || mongoose.model("transections", transectionModel);

export default Transection;