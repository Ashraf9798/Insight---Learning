const Users = require('../models/user');
const Message = require('../models/privateMessage');

module.exports = {

    async getChatPage(req, res) {
        const user = await Users.findOne({'username': req.user.username}).populate('request.userId');
        const nameRegEx = new RegExp("^" + req.user.username.toLowerCase(), "i");
        const chatResult = await Message.aggregate([
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
        const params = req.params.name.split('.');
        const nameParam = params[0];
        const dbMsg = await Message.find({$or: [{'senderName': req.user.username}, {'receiverName': req.user.username}]}).populate('sender').populate('receiver');
        // console.log(dbMsg);
        res.render('privateChat/private', { user, chatResult, dbMsg, name: nameParam });
    },
    async postChatPage(req, res) {
        const params = req.params.name.split('.');
        const nameParam = params[0];
        const nameRegEx = new RegExp("^"+nameParam.toLowerCase(), "i");
        if(req.body.message) {
            const user = await Users.findOne({'username': {$regex: nameRegEx}});
            const newMsg = new Message();
            newMsg.sender = req.user._id;
            newMsg.receiver = user._id;
            newMsg.senderName = req.user.username;
            newMsg.receiverName = user.username;
            newMsg.message = req.body.message;
            newMsg.userImage = req.user.userImage;
            newMsg.createdAt = new Date();
            await newMsg.save();
            // console.log(newMsg);
        }
        if(req.body.chatId) {
            const msgRead = await Message.updateOne({'_id': req.body.chatId}, {'isRead': true});
            // console.log(msgRead);
        }
        res.redirect(`/chat/${req.params.name}`);
    }

}