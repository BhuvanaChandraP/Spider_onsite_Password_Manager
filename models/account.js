const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    title:{
        type:String
    },
    email:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    
});
const Account = mongoose.model('Account',accountSchema);
module.exports = Account ;
// module.exports = mongoose.model('Account', accountSchema);
