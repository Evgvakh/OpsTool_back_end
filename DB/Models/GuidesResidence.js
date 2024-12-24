import mongoose from "mongoose";

const GuideResidence = new mongoose.Schema({    
    residenceTown: {
        type: String,
        required: true,
        set: v => v.toUpperCase()
    }
})

export default mongoose.model("GuideResidence", GuideResidence);