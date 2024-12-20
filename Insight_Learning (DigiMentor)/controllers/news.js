const axios = require('axios');
const Users = require('../models/user');
const Message = require('../models/privateMessage');

module.exports = {

    async getNews(req, res) {
        let user, nameRegEx, chatResult;
        if(req.user) {
            user = await Users.findOne({'username': req.user.username}).populate('request.userId');
        }
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
        const wweNews = await axios.get('https://content.guardianapis.com/search?q=wwe&show-fields=all&api-key=bb85204d-2ae1-4c1a-8c0c-7199d4902997');
        res.render('news', { user, chatResult, wweNews });
    },

}