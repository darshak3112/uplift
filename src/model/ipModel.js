import mongoose from "mongoose";

const ipSchema = new mongoose.Schema({
    ip:{
        type : String,
        required : true
    },
    register : {
        type : Boolean,
        required : true
    },
    login : {
        type : Boolean,
        required : true
    }

},{timestamps:true})


const Ips = mongoose.models.ips || mongoose.model("ips", ipSchema);

export default Ips;