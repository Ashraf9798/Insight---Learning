const Brand = require('../models/brand');
const Users = require('../models/user');

module.exports = {

    async getFilterResults(req, res) {
        res.redirect('/home');
        // res.render('home');
    },

    async postFilterResults(req, res) {
        const regex = new RegExp((req.body.country), 'gi');
        const result = await Brand.find({'$or': [{'country': regex}, {'name': regex}]});
        // console.log(result);
        let user;
        if(req.user) {
            user = await Users.findOne({'username': req.user.username}).populate('request.userId');
        }
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
        res.render('home', { data: dataChunk, cntry, user });
    }

}