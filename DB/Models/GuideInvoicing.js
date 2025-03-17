import mongoose from "mongoose";

const InvoicingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true        
    }
})

export default mongoose.model("Invoicing", InvoicingSchema);