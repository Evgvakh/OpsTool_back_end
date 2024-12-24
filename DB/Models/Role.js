import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: v => v.toUpperCase()
    }
})

export default mongoose.model("Role", RoleSchema);