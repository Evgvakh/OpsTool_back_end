import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    station: {
        type: String
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },    
    callsPermissons: [
        {
            callID: {
                type: String
            }
        }
    ]
})

export default mongoose.model("User", UserSchema);