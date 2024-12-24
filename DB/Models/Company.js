import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    }
})

export default mongoose.model("Company", CompanySchema);