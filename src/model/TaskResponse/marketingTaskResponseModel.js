import mongoose from "mongoose";

const Schema = mongoose.Schema;

const marketingTaskResponseModel = new Schema ({

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


const MarketingResponse = mongoose.models.MarketingResponse || mongoose.model("MarketingResponse", marketingTaskResponseModel);

export default MarketingResponse;
