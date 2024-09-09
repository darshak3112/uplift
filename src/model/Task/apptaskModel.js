import mongoose from "mongoose";
import Tester from "../testerModel";

const apptaskSchema = new mongoose.Schema({
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
        applied_testers : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tester'
            }
        ],
        selected_tester : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Tester'
            }
        ],
},{timestamps:true});

const App = mongoose.models.App || mongoose.model("App", apptaskSchema);

export default App;

