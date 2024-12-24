import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    permissons: [
        {
            operation: {
                type: String                
            },
        }
    ],
    callsPermissons: [
        {
            callID: {
                type: String
            }
        }
    ]
})

export default mongoose.model("User", UserSchema);