const User = require('../models/user');

const middleware = {
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        },
}

module.exports = middleware;