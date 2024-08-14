import mongoose from "mongoose";

const Schema = mongoose.Schema;

const youtubeTaskResponseModel = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Youtube',
        required: true,
    },
    testerId: {
        type: Schema.Types.ObjectId,
        ref: 'Tester',
        required: true,
    },
    response: {
        type: String,
        required: true
    }
}, { timestamps: true });


const YoutubeResponse = mongoose.models.YoutubeResponse || mongoose.model("YoutubeResponse", youtubeTaskResponseModel);

export default YoutubeResponse;
