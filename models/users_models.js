const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: false
    }
});


module.exports = mongoose.model('Users', userSchema)

