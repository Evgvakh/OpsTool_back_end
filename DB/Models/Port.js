import mongoose from "mongoose";

const PortSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        set: v => v.toUpperCase(),
        unique: true,
        maxLength: 3,        
    }
})

export default mongoose.model("Port", PortSchema);