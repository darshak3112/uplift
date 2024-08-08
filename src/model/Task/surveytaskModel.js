import mongoose from "mongoose";

const surveytaskSchema = new mongoose.Schema({
    creator :{
        type : mongoose.Schema.Types.ObjectId,
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
    noOfQuestions:{
        type : Number,
        required : true
    },
    questions:[{
        title:String,
        answer_type:String,
        options:[]
    }],
    tester_ids : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tester'
        }
    ],
},{ timestamps: true})

const Survey = mongoose.models.Survey || mongoose.model("Survey", surveytaskSchema);

export default Survey;