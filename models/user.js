const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },   
    accounts:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Account'
    }
    


});


UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',UserSchema);
module.exports = User ;
