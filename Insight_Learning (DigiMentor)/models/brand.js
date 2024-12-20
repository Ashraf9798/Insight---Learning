const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    image: {
        path: String,
        filename: String
    },
    fans: [{
        username: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        }
    }]    
});

module.exports = mongoose.model('Brand', brandSchema);