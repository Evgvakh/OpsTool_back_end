import mongoose from "mongoose";

const LanguageSchema = new mongoose.Schema({    
    name : {
        type: String,
        required: true,
        minlength: [3, 'Must be 3 chars'],
        maxlength: [3, 'Must be 3 chars']        
    }
})

export default mongoose.model('Language', LanguageSchema)