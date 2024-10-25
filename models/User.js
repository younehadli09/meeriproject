const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 40,
    },
    passwordhash: {
        type: String,
        required: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
  

    phonenumber: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10,
    },
    wilaya: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    commune: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    code_postal: {
        type: String, // Changed to String to handle different formats
        required: true,
        minlength: 3,
        maxlength: 10,
    },
    adresse: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
