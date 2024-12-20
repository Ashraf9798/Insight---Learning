const Brand = require('../models/brand');

module.exports = {

    adminPage(req, res) {
        res.render('admin/dashboard');
    },

    async createPage(req, res) {
        if(req.file) {
            const { path, filename } = req.file;
            req.body.image = { path, filename };
        }
        const newBrand = new Brand({
            name: req.body.brand,
            country: req.body.country,
            image: req.file
        });
        await newBrand.save();
        res.redirect('/home'); 
    },

}