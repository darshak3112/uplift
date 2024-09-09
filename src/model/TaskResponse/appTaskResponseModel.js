import mongoose from "mongoose";

const Schema = mongoose.Schema;

const appTaskResponseModel = new Schema({
    taskId : {
        type : Schema.Types.ObjectId,
        ref : 'Survey',
        required : true,
    },
    testerId : {
        type : Schema.Types.ObjectId,
        reference : 'Tester',
        required : true,
    },
    response : [{
        text: {
            type : String,
        },
        date:{
            type: Date,
        }
    }]
})

const AppResponse = mongoose.models.AppResponse || mongoose.model("AppResponse", appTaskResponseModel);

export default AppResponse;