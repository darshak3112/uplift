import mongoose from "mongoose";

const surveyTaskSchema = new mongoose.Schema({
    creator :{
        type : Schema.Types.ObjectId,
        ref : 'Creator',
        required : true
    },
    post_date : {
        type : Date,
        default : Date.now,
        required : true
    },
    end_date: {
        type : Date,
        required : true
    },
    tester_no : {
        type : Number,
        required : true
    },
    tester_age: {
        type : Number,
        required : true
    },
    tester_gender:{
        type : String,
        required : true
    },
    country:{
        type : String,
        required : true
    },
    heading:{
        type : String,
        required : true
    },
    instruction:{
        type : String,
        required : true
    },
    questions:[{
        title:String,
        answer_type:String,
    }],
    tester_ids : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tester'
        }
    ],
})

const Survey = mongoose.models.survey || mongoose.model("survey", surveyTaskSchema);

export default Survey;