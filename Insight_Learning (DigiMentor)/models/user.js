const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     default: ''
    // },
    fullname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true
    },
    userImage: {
        type: String,
        default: 'https://res.cloudinary.com/abhishek26127/image/upload/v1605255766/kpawelrpbowr0lbxflny.png'
    },
    facebook: {
        type: String,
        default: ''
    },
    fbToken: {
        type: Array
    },
    google: {
        type: String,
        default: ''
    },
    sentRequest: [{
        username: {
            type: String,
            default: ''
        }
    }],
    request: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            default: ''
        }
    }],
    friendsList: [{
        friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        friendName: {
            type: String,
            default: ''
        }
    }],
    totalRequest: {
        type: Number,
        default: 0
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);