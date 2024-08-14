import mongoose from "mongoose";

const youtubetaskSchema = new mongoose.Schema({
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
    youtube_thumbnails:[{
        title:String,
        link :String
    }],
    web_link:{
        type : String,
        required : true
    },
    tester_ids : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tester'
        }
    ],
},{timestamps: true})

const Youtube = mongoose.models.youtube || mongoose.model("youtube", youtubetaskSchema);

export default Youtube;