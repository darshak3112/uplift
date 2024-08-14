import mongoose from "mongoose";


const Schema = mongoose.Schema;

const surveyTaskResponseMondel = new Schema ({
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
        questionId : {
            type : Number,
            required : true,
        },
        answer :{
            type : String ,
            required : true
        }
    }]
},{timestamps: true})

const SurveyResponse = mongoose.models.SurveyResponse || mongoose.model("SurveyResponse", surveyTaskResponseMondel);

export default SurveyResponse;