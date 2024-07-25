import mongoose from "mongoose";


const Schema = mongoose.Schema;

const webTaskResponseMondel = new Schema ({
    taskId : {
        type : Schema.Types.ObjectId,
        ref : 'Web',
        required : true,
    },
    testerId : {
        type : Schema.Types.ObjectId,
        reference : 'Tester',
        required : true,
    },
    response : [{
        questionId : {
            type : Number,
            required : true,
        },
        answer :{
            type : String ,
            required : true
        }
    }]
})

const WebResponse = mongoose.models.webResponse || mongoose.model("webResponse", webResponseTaskSchema);

export default WebResponse;