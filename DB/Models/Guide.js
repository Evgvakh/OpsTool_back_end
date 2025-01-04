import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        set: v => v.toLowerCase()
    },
    lastName: {
        type: String,
        required: true,
        set: v => v.toLowerCase()
    },
    residence: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        set: v => v.toLowerCase()
    },
    bookings: [
        {
            callId: {
                type: String,
                required: true                
            },
            callDate: {
                type: String,
                required: true    
            }
        }
    ],
    languages: {
        type: [String],
        default: []        
    },
    workedHours: [
        {
            callId: {
                type: String
            },
            hours: {
                type: String
            }
        }
    ]
})

export default mongoose.model("Guide", GuideSchema);