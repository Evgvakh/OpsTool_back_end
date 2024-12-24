import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    callID: {
        type: String,
        required: true
    },
    guideID: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

export default mongoose.model("Comment", CommentSchema);