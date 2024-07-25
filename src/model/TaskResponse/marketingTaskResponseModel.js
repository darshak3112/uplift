import mongoose from "mongoose";

const Schema = mongoose.Schema;

const surveyTaskResponseMondel = new Schema ({
    taskId : {
        type : Schema.Types.ObjectId,
        ref : 'Marketing',
        required : true,
    },
    testerId : {
        type : Schema.Types.ObjectId,
        reference : 'Tester',
        required : true,
    },
    response : [{
        order : {
            orderId : {
                type : String,
                required:true
            },
        },
        liveReview : {
            reviewLink : {
                type : String,
                required : true,
                default : null
            },
            reviewImage : {
                type : String,
                required : true,
                default : null
            }
        }
    }]
},{timestamps : true})

const SurveyResponse = mongoose.models.surveyResponse || mongoose.model("surveyResponse", surveyResponseTaskSchema);

export default SurveyResponse;