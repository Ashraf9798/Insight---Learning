const Brand = require('../models/brand');
const Users = require('../models/user');
const Message = require('../models/privateMessage');

module.exports = {

    async homepage(req, res) {
        const result = await Brand.find({});
        let user, nameRegEx, chatResult;
        if(req.user) {
            user = await Users.findOne({'username': req.user.username}).populate('request.userId');
        }
        // console.log(result);
        const dataChunk = [];
        const chunkSize = 3;
        for(let i = 0; i < result.length; i+=chunkSize) {
            dataChunk.push(result.slice(i, i + chunkSize));
        } 
        const cntry = await Brand.aggregate([{
            $group: {
                _id: '$country'
            }
        }]);
        // console.log(cntry);
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
        res.render('home', { data: dataChunk, cntry, user, chatResult });
    },
    async addFavourites(req, res) {
        const fav = await Brand.updateOne({
            '_id': req.body.id, 
            'fans.username': { $ne: req.user.username }
        }, { $push: { fans: {
                username: req.user.username,
                email: req.user.email
            }}
        });
        if(req.body.chatId) {
            const msgRead = await Message.updateOne({'_id': req.body.chatId}, {'isRead': true});
            // console.log(msgRead);
        }
        // console.log(fav); 
        res.redirect('/home');
    }

}