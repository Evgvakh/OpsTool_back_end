import mongoose from "mongoose";

const ShipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    code: {
        type: String,
        set: v => v.toUpperCase(),
        unique: true,
        maxLength: 3        
    }
})

export default mongoose.model("Ship", ShipSchema);