const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    message: {
        type: String
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderName: {
        type: String
    },
    receiverName: {
        type: String
    },
    userImage: {
        type: String,
        default: 'https://res.cloudinary.com/abhishek26127/image/upload/v1605255766/kpawelrpbowr0lbxflny.png'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    } 
});

module.exports = mongoose.model('privateMessage', messageSchema);