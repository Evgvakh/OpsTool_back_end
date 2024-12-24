import mongoose from "mongoose";

const CallSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true        
    },
    port: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    ship: {
        type: String,
        required: true
    },
    arrival: {
        type: String,
        required: true
    },
    departure: {
        type: String,
        required: true
    }
})

export default mongoose.model("Call", CallSchema);