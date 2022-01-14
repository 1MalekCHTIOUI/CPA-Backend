const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
mongoose.Schema.Types.Boolean.convertToFalse.add('');

const accountSchema = new Schema({
    username :  {
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
    isConfirmed: { 
        type: Boolean,
        default: false,
        required: false
    },
    created_at: { 
        type: Date,
        required: false
    },
    updated_at: { 
        type: Date,
        required: false
    }

})

accountSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
      this.created_at = now;
    }
    next();
});

const Account = mongoose.model('account', accountSchema)
module.exports = Account