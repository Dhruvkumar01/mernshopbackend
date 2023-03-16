const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
},
    {timestamps: true}
);

const User= mongoose.model('User', userSchema);

module.exports= User;