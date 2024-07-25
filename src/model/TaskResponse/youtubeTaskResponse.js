import mongoose from "mongoose";

const Schema = mongoose.Schema;

const youtubeTaskResponseMondel = new Schema ({
    taskId : {
        type : Schema.Types.ObjectId,
        ref : 'Youtube',
        required : true,
    },
    testerId : {
        type : Schema.Types.ObjectId,
        reference : 'Tester',
        required : true,
    },
    response : [{
        url : String
    }]
    
})

const SurveyResponse = mongoose.models.surveyResponse || mongoose.model("surveyResponse", surveyResponseTaskSchema);

export default SurveyResponse;