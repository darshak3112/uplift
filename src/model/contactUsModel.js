import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    message :{
        type : String,
        required : true
    }
})


const ContactUs = mongoose.models.ContactUs || mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;