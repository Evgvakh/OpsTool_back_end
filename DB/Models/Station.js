import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toUpperCase()
    }
})

export default mongoose.model("Station", StationSchema);