const Users = require('../models/user');
const Message = require('../models/privateMessage');
const groupMessage = require('../models/groupMessage');
 
module.exports = {

    async groupPage(req, res) {
        const groupName = req.params.name;
        const user = await Users.findOne({'username': req.user.username}).populate('request.userId');
        if(req.user) {
            nameRegEx = new RegExp("^" + req.user.username.toLowerCase(), "i");
            chatResult = await Message.aggregate([
                {$match: {
                    $or: [
                        {'senderName': nameRegEx}, 
                        {'receiverName': nameRegEx}
                    ]}
                },
                {$sort: {'createdAt': -1}},
                {$group: {
                    '_id': {
                        'last_msg_between': {
                            $cond: [
                                {
                                    $gt: [
                                        {$substr: ['$senderName', 0, 1]},
                                        {$substr: ['$receiverName', 0, 1]}
                                    ]
                                },
                                {$concat: ['$senderName',' and ','$receiverName']},
                                {$concat: ['$receiverName',' and ','$senderName']}
                            ]
                        }
                    },
                    'body': {
                        $first: '$$ROOT'
                    }
                }} 
            ]);
        }
        const grpMsg = await groupMessage.find({}).populate('sender');
        res.render('groupChat/group', { groupName, user, chatResult, grpMsg });
    },
    async postGroupPage(req, res) {
        // console.log(req.body);
        if(req.body.receiver) {
            const receiver = await Users.updateOne({
                'username': req.body.receiver,
                'request.userId': { $ne: req.user._id },
                'friendsList.friendId': { $ne: req.user._id }                       
            }, { $push: {
                    request: { userId: req.user._id, username: req.user.username }
                },
                $inc: { totalRequest: 1 }
            });

            const sender = await Users.updateOne({
                'username': req.user.username,
                'sentRequest.username': { $ne: req.body.receiver }
            }, { $push: {
                    sentRequest: { username: req.body.receiver }
                }
            });
        }
        //when user accepts friend request
        // console.log(req.body);
        if(req.body.senderId) {
            const rec = await Users.updateOne({
                '_id': req.user._id,
                'friendsList.friendId': { $ne: req.body.senderId }
            }, { $push: {
                    friendsList: { 
                        friendId: req.body.senderId, 
                        friendName: req.body.senderName 
                    }
                },
                $pull: {
                    request: { 
                        userId: req.body.senderId, 
                        username: req.body.senderName 
                    }
                },
                $inc: { totalRequest: -1 } 
            });
            const sen = await Users.updateOne({
                '_id': req.body.senderId,
                'friendsList.friendId': { $ne: req.user._id }
            }, { $push: {
                    friendsList: { 
                        friendId: req.user._id, 
                        friendName: req.user.username 
                    }
                },
                $pull: {
                    sentRequest: { 
                        username: req.user.username 
                    }
                }
            });
        }
        //when user rejects friend request
        if(req.body.userId) {
            const receiveR = await Users.updateOne({
                '_id': req.user._id,
                'request.userId': { $eq: req.body.userId }
            }, { $pull: {
                    request: { 
                        userId: req.body.userId 
                    }
                },
                $inc: { totalRequest: -1 }
            });
            const sendR = await Users.updateOne({
                '_id': req.body.userId,
                'sentRequest.username': { $eq: req.user.username }
            }, { $pull: {
                    sentRequest: { 
                        username: req.user.username 
                    }
                }
            });
        }
        if(req.body.message) {
            const groupMsg = await new groupMessage();
            groupMsg.sender = req.user._id;
            groupMsg.body = req.body.message;
            groupMsg.groupName = req.body.groupName;
            groupMsg.createdAt = Date.now();
            await groupMsg.save();
            // console.log(groupMsg);
        }
        res.redirect(`/group/${req.params.name}`);
    }

}