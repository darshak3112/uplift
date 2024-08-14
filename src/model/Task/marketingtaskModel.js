import mongoose from "mongoose";

const marketingtaskSchema = new mongoose.Schema({
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
    product_details:{
        type : String,
        required : true
    },
    product_link:{
        type : String,
        required : true
    },
    product_price:{
        type : String,
        required : true
    },
    refund_percentage:{
        type : Number,
        required : true
    },
    tester_ids : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tester'
        }
    ],
},{timestamps: true})

const Marketing = mongoose.models.marketing || mongoose.model("marketing", marketingtaskSchema);

export default Marketing;