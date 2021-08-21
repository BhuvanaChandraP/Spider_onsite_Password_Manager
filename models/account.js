const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    title:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    
});

module.exports = mongoose.model('Account', accountSchema);
