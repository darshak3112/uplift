import mongoose from "mongoose";

const Schema = mongoose.Schema;

const transectionModel = new Schema ({
    type : {
        type : String,
        required : true
    },
    testerId : {
        type : Schema.Types.ObjectId,
        ref : 'Tester'
    },
    creatorId : {
        type : Schema.Types.ObjectId,
        ref : 'Creator'
    },
    bankDetails : {
        accountNo : Number,
        IFSC:String,
        bankName : String
    }
})

const Transection = mongoose.models.transections || mongoose.model("transections", transectionModel);

export default Transection;